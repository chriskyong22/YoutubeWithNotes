import React from "react"
import { videosType, videoType, messagesType, messageType } from "../App"
import Card from "./Card"

interface listProps {
    videos: videosType["videos"];
    setVideos: React.Dispatch<React.SetStateAction<videosType["videos"]>>;
    favorites: videosType["videos"];
    setFavorites: React.Dispatch<React.SetStateAction<videoType[]>>
}

const List: React.FC<listProps> = ( { videos, setVideos, favorites, setFavorites } ) => {

    const renderItems = (): JSX.Element[] => {
        return videos.map((video, idx) => {
            return (
                <li className="ListItemContainer" key={idx}>
                    <Card 
                        video={video}
                        videos={videos}
                        setVideos={setVideos}
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