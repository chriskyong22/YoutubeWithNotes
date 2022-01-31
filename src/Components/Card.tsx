import React, { useState, useRef, useLayoutEffect } from "react"
import {  videoType, messagesType } from "../App"
import { YoutubeIframe } from "./YoutubeIframe"
import { Message } from "./Message"
import { getTimestamp } from "../Utilities/helper"

interface cardProps {
    video: videoType;
    messages: messagesType["messages"];
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>;
}

interface inputState {
    beginTime: string;
    text: string;
    endTime: string;
}


const Card: React.FC<cardProps> = ({ video, messages, setMessages }) => {

    const [player, setPlayer] = useState<YT.Player>();

    const getCurrentTime = () => {
        return player?.getCurrentTime();
    }

    const renderMessages = (): JSX.Element[] => {
        return messages.map((message, idx) => {
            return (<div className="ListItemMessageContainer" key={`${message}_${idx}`}>
                    <Message 
                        message={message}
                        seekFunction={seekToTime}
                    />
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

    useLayoutEffect(() => {
        scrollToBottomMessage()
    }, [messages]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!input.text) {
                return;
            }

            let endTime = getCurrentTime();
            // getTimestamp(parseInt(input.beginTime))
            // (endTime) ? getTimestamp(endTime) : ""
            setMessages([
                ...messages,
                [`${input.beginTime}-${(endTime) ? endTime : ""}`, input.text]
            ])
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

    const seekToTime = (timestamp: string): (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void => {
        let beginTime = timestamp;
        console.log(`Seeking to ${beginTime}`)
        return (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>): void => {
            if (player) {
                player.seekTo(parseFloat(beginTime), true);
            }
        }
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