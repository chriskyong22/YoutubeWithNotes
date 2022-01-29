import React from "react"

interface messageProps {
    message: string;
}

export const Message : React.FC<messageProps> = ({ message }) => {
    return (
        <>
            {message}
        </>
    )
}