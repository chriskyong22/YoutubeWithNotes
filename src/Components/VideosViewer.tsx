import React, { useEffect, useState } from "react"
import { videosType, videoType } from "../Models/Video"
import { getAllStoredVideos } from "../Utilities/helper"

interface VideosViewerProp {
    displayedVideos: videosType["videos"];
    setDisplayedVideos: React.Dispatch<React.SetStateAction<videoType[]>>;
}

type customVideoType = videoType & {
    alreadySet: boolean;
}

export const VideosViewer: React.FC<VideosViewerProp> = ({ displayedVideos, setDisplayedVideos }) => {
    const [storedVideos, setStoredVideos] = useState<customVideoType[]>([])

    useEffect(() => {
        retrieveStoredVideos();
    }, [displayedVideos]);

    const retrieveStoredVideos = () => {
        getAllStoredVideos().then((storedVideos) => {
            const displayedVideosID = displayedVideos.map((video) => video.id);
            let customStoredVideos = storedVideos.map((storedVideo) => {
                let video: customVideoType = {
                    'id': storedVideo.id,
                    'title': storedVideo.title,
                    'url': storedVideo.url,
                    alreadySet: false
                }

                if (displayedVideosID.includes(video.id)) {
                    video.alreadySet = true
                }
                return video
            })
            console.log(customStoredVideos);
            setStoredVideos(customStoredVideos);
        }).catch((error) => {
            console.error(`Error occurred when retrieving the stored videos: ${error}`);
        })
    }

    const load = (video: customVideoType) => {
        setDisplayedVideos((oldDisplayedVideos) => {
            const {
                alreadySet,
                ...videoType
            } = video;
            return [
                ...oldDisplayedVideos,
                videoType
            ]
        })
    }

    const unload = (video: customVideoType) => {
        setDisplayedVideos((oldDisplayedVideos) => {
            return oldDisplayedVideos.filter((oldDisplayedVideo) => {
                return oldDisplayedVideo.id !== video.id;
            })
        })
    }

    return (
        <div>
            {
                storedVideos.map((video) => {
                    return (
                        <div key={video.id + "List"} style={{backgroundColor: video.alreadySet? "green" : "red"}}>
                            <div>
                                {video.title}   
                            </div>

                            <div>
                                {video.url}
                            </div>
                            <button
                                onClick={video.alreadySet ? () => unload(video) : () => load(video)}
                            >
                                {video.alreadySet ? "Unload" : "Load"}
                            </button>
                        </div>
                    )
                })
            }
        </div>
    )

}