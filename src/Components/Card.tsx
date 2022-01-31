import React, { useState, useRef, useLayoutEffect, useEffect } from "react"
import {  videoType, videosType } from "../App"
import { getTimestamp } from "../Utilities/helper"
import { Message } from "./Message"

interface cardProps {
    video: videoType;
    videos: videosType["videos"];
    setVideos: React.Dispatch<React.SetStateAction<videosType["videos"]>>;
}

interface inputState {
    beginTime: string;
    text: string;
    endTime: string;
}

declare global {
    function onYouTubeIframeAPIReady(): void;
}

const Card: React.FC<cardProps> = ({ video, videos, setVideos }) => {

    const [player, setPlayer] = useState<YT.Player>();

    const getCurrentTime = () => {
        return player?.getCurrentTime();
    }

    const onReady = () => {
        console.log("Loaded API");
    }

    const loadVideo = () => {
        console.log("Setting the object!")
        let player = new window.YT.Player(`Youtube-Iframe-${video.url}`, {
            events: {
                'onReady': onReady
            }
        })
        if (player.getCurrentTime === undefined) {
            console.log(document.getElementById(`Youtube-Iframe-${video.url}`))
        }
        console.log(player.getCurrentTime);
        setPlayer(player); 
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



    const renderMessages = (): JSX.Element[] => {
        return video.messages.map((message, idx) => {
            return (<div className="ListItemMessageContainer" key={`${message}_${idx}`}>
                    <Message 
                        message={message}
                    />
                </div>);
        })
    }


    const [input, setInput] = useState<inputState>({
        beginTime: "",
        text: "",
        endTime: ""
    })

    // Get reference to a empty div that is the last element of 
    // the chat box to automatically scroll when the messages 
    // box is updated
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottomMessage = (): void => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useLayoutEffect(() => {
        scrollToBottomMessage()
    }, [video.messages]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!input.text) {
                return;
            }

            // let endTime = getCurrentTime();
            // getTimestamp(parseInt(input.beginTime))
            // (endTime) ? getTimestamp(endTime) : ""
            setVideos([
                ...videos,
                video
            ])
            setInput({
                beginTime: "",
                text: "",
                endTime: ""
            });
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInput({
            ...input,
            // beginTime: input.beginTime === "" ? getCurrentTime() + "" : input.beginTime,
            text: event.target.value
        });
    }

    const changeBeginningTimeStamp = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInput({
            ...input, 
            beginTime: event.target.value
        })
    }

    const renderCard = () => {
        return (
            <>
                <div className="ListItemHeader">
                    <iframe 
                        src={video.url}
                        allow="encrypted-media"
                        // width={video.url.indexOf("youtube") == -1 ? "300" : "100%"}
                        // height={video.url.indexOf("youtube") == -1 ? "380" : "75%"}
                        frameBorder="0"
                        loading="lazy"
                        id={`Youtube-Iframe-${video.url}`}
                    >
                    </iframe>
                    <button>Add to Favorites</button>
                </div>
                <div className="ListItemChatContainer">
                    <div className="ListItemMessagesArea Scrollable-Element">
                        <p>Chatroom</p>
                        {renderMessages()}
                        <div className="ListItemLastMessage" ref={messagesEndRef}></div>
                    </div>
                    <textarea
                        placeholder="Send a message"
                        name="messages"
                        className="ListItemSendMessages Hidden-Scrollable-Element"
                        value={input.text}
                        onKeyDown={handleKeyPress}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Beginning Timestamp [HH:MM:SS]"
                        name="beginTime"
                        value={input.beginTime}
                        onChange={changeBeginningTimeStamp}
                    />
                </div>
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