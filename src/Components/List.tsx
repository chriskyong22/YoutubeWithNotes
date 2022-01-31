import React from "react"
import { messagesType, videosType, videoType } from "../App"
import Card from "./Card"

interface listProps {
    videos: videosType["videos"];
    messages: messagesType["messages"];
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>;
    favorites: videosType["videos"];
    setFavorites: React.Dispatch<React.SetStateAction<videoType[]>>
}

const List: React.FC<listProps> = ( { videos, messages, setMessages, favorites, setFavorites } ) => {

    const renderItems = (): JSX.Element[] => {
        return videos.map((video, idx) => {
            return (
                <li className="ListItemContainer" key={idx}>
                    <Card 
                        video={video}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </li>)
         })
    }

    return (
        <ul className="ListContainer">
            {renderItems()}
        </ul>
    )
}

export default List;