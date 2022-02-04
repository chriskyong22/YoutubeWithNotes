import React from "react";
import { videoType } from "../App";
import { updateKey } from "../Services/DBService"
import { exportKey, importKey, exportDatabase, importDatabase as importDB, mimeTypes } from "../Utilities/helper"
import { DbRow } from "../Services/DBService"
import { messagesType } from "./ChatboxContainer";

interface ChatboxHeaderProps {
    video: videoType
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>
}

export const ChatboxHeader: React.FC<ChatboxHeaderProps> = ({ video, setMessages }) => {
    console.log("Rerendering the Chatbox Header");
    const exportNotes = () => {
        exportKey(video.id, video.url);
    }

    const importNotes = () => {
        importKey(importNotesCallback);
    }

    const importNotesCallback = async (files : FileList): Promise<void> => {
        const selectedFile = files[0];
        if (selectedFile && selectedFile.type === mimeTypes.JSON) {
            let text = await selectedFile.text();
            let importedVideo: DbRow = JSON.parse(text);
            // For further safety, we can check the type of each 
            // element in the 'notes' property to ensure it is
            // a string array with two values.
            if (importedVideo.hasOwnProperty('notes') && 
                    importedVideo.hasOwnProperty('url') && 
                    importedVideo.hasOwnProperty('id') && 
                    importedVideo.hasOwnProperty('title')) {
                if (importedVideo.id !== '') {
                    updateKey({
                        'id': importedVideo.id,
                        'title': importedVideo.title,
                        'url': importedVideo.url
                    }, importedVideo.notes);
                    if (importedVideo.id === video.id) {
                        setMessages(importedVideo.notes);
                    }
                }
            }
        }
    }

    const importDatabase = () => {
        importDB(importDatabaseCallback);
    }

    const importDatabaseCallback = async (files: FileList): Promise<void> => {
        const selectedFile = files[0];
        if (selectedFile && selectedFile.type === mimeTypes.JSON) {
            let rowsJSONSTRING = await selectedFile.text();
            let rows: DbRow[] = JSON.parse(rowsJSONSTRING);
            rows.forEach((importedVideo) => {
                if (importedVideo.hasOwnProperty('notes') && 
                        importedVideo.hasOwnProperty('url') && 
                        importedVideo.hasOwnProperty('id') && 
                        importedVideo.hasOwnProperty('title')) {
                    if (importedVideo.id !== '') {
                        updateKey({
                            'id': importedVideo.id,
                            'title': importedVideo.title,
                            'url': importedVideo.url
                        }, importedVideo.notes);
                        // TODO: Update all the Card components where the video is loaded otherwise it will not update
                        // the imported database messages. 
                        if (importedVideo.id === video.id) {
                            setMessages(importedVideo.notes);
                        }
                    }
                }
            })
        }
    }

    return (
        <div className="ListItemChatboxHeader"> 
            <div>
                [
                <button onClick={importNotes} className="ListItemChatBoxHeaderBtn">
                    Import
                </button>
                    |
                <button onClick={exportNotes} className="ListItemChatBoxHeaderBtn">
                    Export 
                </button>
                ]
                Notes
            </div>
            
            <div>
                [
                <button onClick={importDatabase} className="ListItemChatBoxHeaderBtn">
                    Import 
                </button>
                    |
                <button onClick={exportDatabase} className="ListItemChatBoxHeaderBtn">
                    Export
                </button>
                ]
                Database
            </div>
        </div>
    )
}

export const MemoizedChatboxHeader = React.memo(ChatboxHeader);