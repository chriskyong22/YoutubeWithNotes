import React, { useEffect, useState, useCallback } from "react"
import { videosType, videoType } from "../Models/Video"
import { DbRow } from "../Services/DBService"
import { getAllStoredVideos } from "../Utilities/helper"
import { debounce } from "../Utilities/helper"

interface VideosViewerProp {
    displayedVideos: videosType["videos"];
    setDisplayedVideos: React.Dispatch<React.SetStateAction<videoType[]>>;
}

type customVideoType = DbRow & {
    alreadySet: boolean;
    show: boolean;
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
                    ...storedVideo,
                    alreadySet: false,
                    show: true
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
                notes,
                show,
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

    const [searchValue, setSearchValue] = useState<string>("");

    const handleSearchTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTitle = event.target.value;
        setStoredVideos((oldStoredVideos) => {
            return oldStoredVideos.map((video) => {
                video.show = false;
                if (video.title.startsWith(searchTitle)) {
                    video.show = true;
                }
                return video;
            })
        })
    }

    const debounceSearch = useCallback(debounce(handleSearchTitle, 1000), []);

    const handleSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        debounceSearch(event);
    }

    return (
        <div>
            {
                storedVideos.map((video) => {
                    if (video.show) {
                        return (
                            <div key={video.id + "List"} style={{backgroundColor: video.alreadySet? "green" : "red"}}>
                                <div>
                                    {video.title}   
                                </div>

                                <a 
                                    href={video.url}
                                >
                                    {video.url}
                                </a>
                                <button
                                    onClick={video.alreadySet 
                                                ? () => unload(video) 
                                                : () => load(video)
                                            }
                                >
                                    {video.alreadySet ? "Unload" : "Load"}
                                </button>
                            </div>
                        )
                    } else {
                        return (
                            <div key={video.id + "List"}>
                            </div>
                        )
                    }   
                })
            }
            <div>
                <input 
                    placeholder="Search for a title" 
                    onChange={handleSearchValue}
                    value={searchValue}
                />
            </div>
        </div>
    )

}