import React, { useEffect } from "react";
import { convertToValidURL } from "../Utilities/helper"

interface YoutubeProps{
    id: string,
    url: string,
    setPlayer: React.Dispatch<React.SetStateAction<YT.Player | undefined>>;
}

declare global {
    function onYouTubeIframeAPIReady(): void;
}

export const YoutubeIframe: React.FC<YoutubeProps> = ({ id, url, setPlayer}) => {
    const videoUniqueID = `Youtube-Iframe-${id}`;

    const onReady = (event: YT.PlayerEvent) => {
        setPlayer(event.target); 
        console.log("Loaded API");
    }

    const loadVideo = () => {
        console.log("Setting up the new player")
        new window.YT.Player(videoUniqueID, {
            events: {
                'onReady': onReady
            }
        })
    }

    useEffect(() => {
        // YT script already loaded
        if (window.YT) {
            console.log("Script already exist!")
            loadVideo()
        } else {
            console.log("Setup Player")
            // Creating the tag
            const tag = document.createElement('script')
            tag.src = "https://www.youtube.com/iframe_api"

            // Insert the tag before the first script node 
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            
            window.onYouTubeIframeAPIReady = loadVideo;
        }
    }, [loadVideo])

    return (
        <iframe 
            src={convertToValidURL(url)}
            allow="encrypted-media"
            // width={video.url.indexOf("youtube") == -1 ? "300" : "100%"}
            // height={video.url.indexOf("youtube") == -1 ? "380" : "75%"}
            frameBorder="0"
            loading="lazy"
            id={videoUniqueID}
        >
        </iframe>
    )
}