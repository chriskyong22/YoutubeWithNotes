import React, { useEffect } from "react";

interface YoutubeProps{
    url: string,
    setPlayer: React.Dispatch<React.SetStateAction<YT.Player | undefined>>;
}

declare global {
    function onYouTubeIframeAPIReady(): void;
}

export const YoutubeIframe: React.FC<YoutubeProps> = ({ url, setPlayer}) => {
    const videoUniqueID = `Youtube-Iframe-${url}`;

    const onReady = (event: YT.PlayerEvent) => {
        setPlayer(event.target); 
        console.log("Loaded API");
    }

    const loadVideo = () => {
        console.log("Setting the object!")
        console.log("Setting up the new player")
        let newPlayer = new window.YT.Player(videoUniqueID, {
            events: {
                'onReady': onReady
            }
        })
        if (newPlayer.getCurrentTime === undefined) {
            console.log(document.getElementById(videoUniqueID))
        }
        console.log(newPlayer.getCurrentTime);
    }

    useEffect(() => {
        // YT script already loaded
        if (window.YT) {
            console.log("Script already exist!")
            loadVideo()
        } else {
            // Creating the tag
            const tag = document.createElement('script')
            tag.src = "https://www.youtube.com/iframe_api"

            // Insert the tag before the first script node 
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            console.log("Setup Loading")
            window.onYouTubeIframeAPIReady = loadVideo;
        }
    }, [])

    return (
        <iframe 
            src={url}
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