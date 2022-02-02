import React, { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { MemoizedChatbox } from "./Chatbox";
import { videoType } from "../App"
import { MemoizedMessage, Message } from "./Message"
import { getKey, getAll, updateKey, deleteKey, append } from "../Services/DBService"
import { ChatboxHeader } from "./ChatboxHeader";

export interface messageType {
    message: [string, string];
}

export interface messagesType {
    messages: messageType["message"][];
}

interface ChatBoxContainerProps {
    player: YT.Player | undefined;
    video: videoType;
}

export const ChatboxContainer: React.FC<ChatBoxContainerProps> = ({ player, video}) => {

    const [messages, setMessages] = useState<messagesType["messages"]>([
        ["0-", "TestMessage"]
    ])

    const seekToTime = (timestamp: string): void => {
        let beginTime = timestamp;
        console.log(`Seeking to ${beginTime}`)
        if (player) {
            player.seekTo(parseFloat(beginTime), true);
        }
    }

    const deleteMessage = (message: messageType["message"]): void => {
        console.log(messages);
        setMessages((oldMessages) => {
            let filteredMessages = oldMessages.filter((_message) => {
                return _message !== message;
            })
            updateKey(video.url, filteredMessages);
            console.log(filteredMessages);
            return filteredMessages;
        })
    }

    // Dependent on messages and player (if player is not loaded in, the onClick functions won't work till seekTime is updated)
    const memoizedSeekToTime = useCallback(seekToTime, [messages, player]);

    const memoizedDeleteMessage = useCallback(deleteMessage, [messages]);

    // For performance issues - more messages === more render time thus 
    // should create a fixed number of messages to render and if the user 
    // scrolls up/down, we debounce and load the 
    // next N messages or previous N messages

    // Also we should be using unique ids instead of idx
    // otherwise React will rerender our MessageComponents
    // even if they have not changed 
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


    // // Get reference to a empty div that is the last element of 
    // // the chat box to automatically scroll when the messages 
    // // box is updated
    // const messagesEndRef = useRef<HTMLDivElement>(null);


    // const scrollToBottomMessage = (): void => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    //     }
    // }

    const scrollToBottomMessageWithoutRef = (): void => {
        let div = document.getElementsByClassName(`ListItemLastMessage`)[0]
        if (div) {
            div.scrollIntoView({ behavior: "smooth"});
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
        }).catch((error) => {
            console.log(`[getValues ERROR]: ${error}`)
        })
        console.log("Finished retrieving the notes");
    }

    const storeAllMessages = async (): Promise<void> => {
        console.log("Storing all the messages");
        await updateKey(video.url, messages);
    }

    useEffect(() => {
        getValues();
    }, [])

    useLayoutEffect(() => {
        scrollToBottomMessageWithoutRef();
    }, [messages, player]);

    return (
        <div className="ListItemChatContainer">
            <ChatboxHeader
                video={video}
                setMessages={setMessages}
            />
            <div className="ListItemMessagesArea Scrollable-Element">
                {renderMessages()}
                <div className="ListItemLastMessage"/> 
                {//ref={messagesEndRef}
                }
            </div>
            <MemoizedChatbox
                player={player}
                video={video}
                setMessages={setMessages}
            />
        </div>
    )
}