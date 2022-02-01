import React from "react"
import { getTimestamp } from "../Utilities/helper"
import { messageType } from "./Card"

interface messageProps {
    message: messageType;
    seekFunction: (timestamp: string) => void;
}

export const Message : React.FC<messageProps> = ( { message, seekFunction } ): JSX.Element => {
    let beginTime = message[0].split('-')[0];
    let endTime = message[0].split('-')[1];
    // console.log(message);
    let timestamp = `[${getTimestamp(parseFloat(beginTime))}${endTime != "" ? " - " + getTimestamp(parseFloat(endTime)) : ""}]`
    return (
        <div className="ListItemMessage">
            <div className="ListItemMessageTimestamp" onClick={() => seekFunction(beginTime)}>
                {timestamp}
            </div>
            <div>
                {message[1]}
            </div>
        </div>
    )
}