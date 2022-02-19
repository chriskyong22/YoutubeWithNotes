import React from "react"
import { videosType } from "../Models/Video" 
import { DbRow, getAll } from "../Services/DBService"

interface ListFooterProps {
    setVideos: React.Dispatch<React.SetStateAction<videosType["videos"]>>;
}

export const ListFooter: React.FC<ListFooterProps> = ({ setVideos }): JSX.Element => {
    const loadAllVideos = async () => {
        let DbRows: DbRow[] | void = await getAll();
        if (DbRows) {
            setVideos((alreadyLoadedVideos) => {
                console.log(alreadyLoadedVideos);
                let allVideos = [...alreadyLoadedVideos];
                if (DbRows) {
                    let notLoadedVideos = DbRows.filter((row) => {
                        return !(alreadyLoadedVideos.some((loadedVideo) => {
                            return loadedVideo.id === row.id;
                        }));
                    })
                    console.log(notLoadedVideos);
                    notLoadedVideos.forEach((video) => {
                        allVideos.push({
                            'title': video.title,
                            'url': video.url,
                            'id': video.id
                        })
                    })
                }
                return allVideos;
            })
        }
    }

    return (
        <>
            <button onClick={loadAllVideos}>
                Load all stored videos.
            </button>
        </>
    )
}