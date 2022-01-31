import React from "react"
import { messageType } from "../App"

interface messageProps {
    message: messageType;
}

export const Message : React.FC<messageProps> = ( { message } ): JSX.Element => {
    return (
        <div className="ListItemMessage">
            <div className="ListItemMessageTimestamp">
                {message[0]}
            </div>
            <div>
                {message[1]}
            </div>
        </div>
    )
}