import React, { useState, useRef, useLayoutEffect } from "react"
import {  videoType } from "../App"
import { Message } from "./Message"

interface cardProps {
    video: videoType;
    messages: string[];
    setMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

const Card: React.FC<cardProps> = ({ video, messages, setMessages }) => {

    const renderMessages = (): JSX.Element[] => {
        return messages.map((message, idx) => {
            return (<div className="ListItemMessage" key={`${message}_${idx}`}>
                    <Message 
                        message={message}
                    />
                </div>);
        })
    }

    const [input, setInput] = useState<string>("")

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
            setMessages([
                ...messages,
                input
            ])
            setInput("");
            event.preventDefault();
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(
            event.target.value
        );
    }

    const renderCard = () => {
        return (
            <>
                <div className="ListItemHeader">
                    <iframe 
                        src={video.url}
                        allow="encrypted-media"
                        // width={video.url.indexOf("youtube") == -1 ? "300" : "100%"}
                        // height={video.url.indexOf("youtube") == -1 ? "380" : "75%"}
                        frameBorder="0"
                        loading="lazy"
                    >
                    </iframe>
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
                        value={input}
                        onKeyDown={handleKeyPress}
                        onChange={handleChange}
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