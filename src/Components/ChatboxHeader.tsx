import React from "react";
import { videoType } from "../App";
import { updateKey } from "../Services/DBService"
import { exportKey, importKey } from "../Utilities/helper"
import { DbRow } from "../Services/DBService"
import { messagesType } from "./ChatboxContainer";

interface ChatboxHeaderProps {
    video: videoType
    setMessages: React.Dispatch<React.SetStateAction<messagesType["messages"]>>
}

export const ChatboxHeader: React.FC<ChatboxHeaderProps> = ({ video, setMessages }) => {
    console.log("Rerendering the Chatbox Header");
    const exportNotes = () => {
        exportKey(video.url);
    }

    const importNotes = () => {
        importKey(importNotesCallback);
    }

    const importNotesCallback = (tbRow: DbRow) => {
        if (tbRow.url !== '') {
            updateKey(video, tbRow.notes);
            if (video.url === tbRow.url) {
                setMessages(tbRow.notes);
            }
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
                <button className="ListItemChatBoxHeaderBtn">
                    Import 
                </button>
                    |
                <button className="ListItemChatBoxHeaderBtn">
                    Export
                </button>
                ]
                Database
            </div>
        </div>
    )
}

export const MemoizedChatboxHeader = React.memo(ChatboxHeader);