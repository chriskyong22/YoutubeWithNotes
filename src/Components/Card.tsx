import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react"
import { videoType } from "../App"
import { YoutubeIframe } from "./YoutubeIframe"
import { ChatboxContainer } from "./ChatboxContainer"

interface cardProps {
    video: videoType;
}

const Card: React.FC<cardProps> = ({ video }) => {

    const [player, setPlayer] = useState<YT.Player>();

    const renderCard = () => {
        return (
            <>
                <div className="ListItemHeader">
                    <YoutubeIframe
                        setPlayer={setPlayer}
                        url={video.url}
                        id={video.id}
                    />
                </div>
                <ChatboxContainer
                    player={player}
                    video={video}
                />
            </>
        )
    }

    return (
        <>
            {renderCard()}
        </>
    )
}

export default Card;