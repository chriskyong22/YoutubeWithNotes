import React, { useState } from "react"
import { messagesType, messageType } from "./ChatboxContainer"
import { videoType } from "../App"
import { getTimestamp } from "../Utilities/helper"
import { append } from "../Services/DBService"
import { v4 as uuidv4 } from "uuid"

interface inputState {
    beginTime: string;
    text: string;
    endTime: string;
}

interface chatBoxProps { 
    player: YT.Player | undefined;
    video: videoType;
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>
}

export const Chatbox: React.FC<chatBoxProps> = ({player, video, setMessages}): JSX.Element => {

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
        await append(video, newMessage);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!input.text) {
                return;
            }
            let endTime = getCurrentTime();
            let newMessage: messageType["message"] = [
                `${input.beginTime}-${(endTime) ? endTime : ""}`,
                input.text,
                uuidv4()
            ];
            
            setMessages((oldMessages) => [...oldMessages, newMessage])

            storeNewMessage(newMessage);

            setInput({
                beginTime: "",
                text: "",
                endTime: ""
            });
            
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        
        setInput((oldInput) => {
            return {
                ...oldInput,
                beginTime: oldInput.beginTime === "" ? getCurrentTime() + "" : oldInput.beginTime,
                text: event.target.value
            }
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
                value={input.beginTime !== "" && input.beginTime !== 'undefined' ? getTimestamp(parseFloat(input.beginTime)) : ""}
                onChange={changeBeginningTimeStamp}
            />
        </>
    )
}

export const MemoizedChatbox = React.memo(Chatbox);