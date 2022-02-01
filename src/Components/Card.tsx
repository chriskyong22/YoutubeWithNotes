import React, { useState, useRef, useLayoutEffect, useEffect } from "react"
import {  videoType } from "../App"
import { YoutubeIframe } from "./YoutubeIframe"
import { Message, MemoizedMessage } from "./Message"
import { getKey, getAll, updateKey, deleteKey, append } from "../Services/DBService"
import { getTimestamp } from "../Utilities/helper"
import { useCallback } from "react"

export interface messageType {
    message: [string, string];
}

export interface messagesType {
    messages: messageType["message"][];
}

interface cardProps {
    video: videoType;
}

interface inputState {
    beginTime: string;
    text: string;
    endTime: string;
}


const Card: React.FC<cardProps> = ({ video }) => {

    const [messages, setMessages] = useState<messagesType["messages"]>([
        ["0-", "TestMessage"]
    ])
    
    const [player, setPlayer] = useState<YT.Player>();

    const getCurrentTime = () => {
        return player?.getCurrentTime();
    }

    const renderMessages = (): JSX.Element[] => {
        return messages.map((message, idx) => {
            return (<div className="ListItemMessageContainer" key={`${message}_${idx}`}>
                    {
                        player !== undefined ?
                        <MemoizedMessage 
                            message={message}
                            seekFunction={memoizedSeekToTime}
                            deleteMessage={memoizedDeleteMessage}
                        /> :
                        ""
                    }
                </div>);
        })
    }

    const [input, setInput] = useState<inputState>({
        beginTime: "",
        text: "",
        endTime: ""
    })

    // Get reference to a empty div that is the last element of 
    // the chat box to automatically scroll when the messages 
    // box is updated
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottomMessage = (): void => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    const getValues = (): void => {
        getKey(video.url).then((_messages) => {
                let formattedMessages: messagesType["messages"] = [];
                console.log("Retrieved Notes from DB")
                if (_messages) {
                    _messages.notes.map((message) => {
                        formattedMessages.push([message[0], message[1]]);
                    })
                }
                setMessages(formattedMessages);
        })
        console.log("Finished retrieving the notes");
    }

    const storeAllMessages = async (): Promise<void> => {
        console.log("Storing all the messages");
        await updateKey(video.url, messages);
    }

    const storeNewMessage = async (newMessage: messageType["message"]): Promise<void> => {
        console.log("Storing the new message!");
        await append(video.url, newMessage);
    }

    useEffect(() => {
        getValues();
    }, [])

    useLayoutEffect(() => {
        scrollToBottomMessage()
    }, [messages]);

    const seekToTime = (timestamp: string): void => {
        let beginTime = timestamp;
        console.log(`Seeking to ${beginTime}`)
        if (player) {
            player.seekTo(parseFloat(beginTime), true);
        }
    }

    const deleteMessage = (message: messageType["message"]): void => {
        console.log(messages);
        let filteredMessages = messages.filter((_message) => {
            return _message !== message;
        })
        console.log(filteredMessages);
        setMessages(filteredMessages);
    }

    // Dependent on messages and player (if player is not loaded in, the onClick functions won't work till seekTime is updated)
    const memoizedSeekToTime = useCallback(seekToTime, [messages, player]);

    const memoizedDeleteMessage = useCallback(deleteMessage, [messages]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!input.text) {
                return;
            }
            let endTime = getCurrentTime();
            let newMessage: messageType["message"] = [`${input.beginTime}-${(endTime) ? endTime : ""}`, input.text];
            
            setMessages([
                ...messages,
                newMessage
            ])

            storeNewMessage([newMessage[0], newMessage[1]]);

            setInput({
                beginTime: "",
                text: "",
                endTime: ""
            });
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInput({
            ...input,
            beginTime: input.beginTime === "" ? getCurrentTime() + "" : input.beginTime,
            text: event.target.value
        });
    }

    const changeBeginningTimeStamp = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInput({
            ...input, 
            beginTime: event.target.value
        })
    }
    
    const renderCard = () => {
        return (
            <>
                <div className="ListItemHeader">
                    <YoutubeIframe
                        setPlayer={setPlayer}
                        url={video.url}
                    />
                    <button>Add to Favorites</button>
                </div>
                <div className="ListItemChatContainer">
                    <div className="ListItemMessagesArea Scrollable-Element">
                        <p>Chatroom</p>
                        {renderMessages()}
                        <div className="ListItemLastMessage" ref={messagesEndRef}></div>
                    </div>
                    <textarea
                        placeholder="Send a message"
                        name="messages"
                        className="ListItemSendMessages Hidden-Scrollable-Element"
                        value={input.text}
                        onKeyDown={handleKeyPress}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Beginning Timestamp [HH:MM:SS]"
                        name="beginTime"
                        value={input.beginTime !== "" ? getTimestamp(parseFloat(input.beginTime)) : ""}
                        onChange={changeBeginningTimeStamp}
                    />
                </div>
            </>
        )
    }

    return (
        <>
            {renderCard()}
        </>
    )
}

export default Card;