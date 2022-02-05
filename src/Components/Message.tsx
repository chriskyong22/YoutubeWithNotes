import React from "react"
import { getTimestamp, copyToClipboard } from "../Utilities/helper"
import { messageType } from "./ChatboxContainer"

interface messageProps {
    message: messageType["message"];
    seekFunction: (timestamp: string) => void;
    deleteMessage: (message: messageType["message"]) => void;
}

export const Message: React.FC<messageProps> = ({ message, seekFunction, deleteMessage }): JSX.Element => {
    let beginTime = parseFloat(message[0].split('-')[0]);
    let endTime = message[0].split('-')[1]
    console.log(`Rendering a new message component!`)
    let timestamp = `[${getTimestamp(beginTime)}${endTime != "" ? " - " + getTimestamp(parseFloat(endTime)) : ""}]`
    return (
        <div className="ListItemMessage">
            <button onClick={() => deleteMessage(message)} title={"Delete Note"} className="ListItemMessageDeleteBtn">
                [D]
            </button>
            <div className="ListItemMessageTimestamp" title={`Go to ${getTimestamp(beginTime)}`}onClick={() => seekFunction(beginTime + "")}>
                {timestamp}
            </div>
            <div className="ListItemMessageText" onClick={copyToClipboard}>
                {message[1]}
            </div>
        </div>
    )
}

export const MemoizedMessage = React.memo(Message);