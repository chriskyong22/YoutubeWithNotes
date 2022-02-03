import React from "react"
import { videosType } from "../App" 
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
                            return loadedVideo.url === row.url;
                        }));
                    })
                    console.log(notLoadedVideos);
                    // TODO: Fix it to get the title/id from the DB
                    notLoadedVideos.forEach((video) => {
                        allVideos.push({
                            'title': 'someTitle',
                            'url': video.url,
                            'id': 'someUniqueID'
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