import React from "react"
import { getTimestamp } from "../Utilities/helper"
import { messageType } from "./Card"

interface messageProps {
    message: messageType["message"];
    seekFunction: (timestamp: string) => void;
    deleteMessage: (message: messageType["message"]) => void;
}

export const Message: React.FC<messageProps> = ({ message, seekFunction, deleteMessage }): JSX.Element => {
    let beginTime = message[0].split('-')[0];
    let endTime = message[0].split('-')[1];
    console.log(`Rendering a new message component!`);
    let timestamp = `[${getTimestamp(parseFloat(beginTime))}${endTime != "" ? " - " + getTimestamp(parseFloat(endTime)) : ""}]`
    return (
        <div className="ListItemMessage">
            <div className="ListItemMessageTimestamp" onClick={() => seekFunction(beginTime)}>
                {timestamp}
            </div>
            <button onClick={() => deleteMessage(message)}>
                    Delete
            </button>
            <div>
                {message[1]}
            </div>
        </div>
    )
}

export const MemoizedMessage = React.memo(Message);