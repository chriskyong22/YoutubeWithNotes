import React, { useState } from "react"
import { messagesType, messageType } from "./Card"
import { videoType } from "../App"
import { getTimestamp } from "../Utilities/helper"
import { append } from "../Services/DBService"

interface inputState {
    beginTime: string;
    text: string;
    endTime: string;
}

interface chatBoxProps { 
    player: YT.Player | undefined;
    video: videoType;
    messages: messagesType["messages"]
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>
}

export const Chatbox: React.FC<chatBoxProps> = ({player, video, messages, setMessages}): JSX.Element => {

    const getCurrentTime = () => {
        return player?.getCurrentTime();
    }

    const [input, setInput] = useState<inputState>({
        beginTime: "",
        text: "",
        endTime: ""
    })

    const storeNewMessage = async (newMessage: messageType["message"]): Promise<void> => {
        console.log("Storing the new message!");
        await append(video.url, newMessage);
    }

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

    return (
        <>
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
        </>
    )
}
