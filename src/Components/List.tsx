import React from "react"
import { videosType, videoType } from "../Models/Video"
import Card from "./Card"

interface listProps {
    videos: videosType["videos"];
    favorites: videosType["videos"];
    setFavorites: React.Dispatch<React.SetStateAction<videoType[]>>
}

const List: React.FC<listProps> = ( { videos, favorites, setFavorites } ) => {
    

    const renderItems = (): JSX.Element[] => {
        return videos.map((video) => {
            return (
                <li className="ListItemContainer" key={video.id}>
                    <Card 
                        video={video}
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