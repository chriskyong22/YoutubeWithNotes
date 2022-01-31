import React, { useState } from "react"
import { videoType, videosType } from "../App"

interface parameters {
    videos: videosType["videos"];
    setVideos: React.Dispatch<React.SetStateAction<videoType[]>>;
}

// interface inputType {
//     title: string;
//     url: string;
//     id: string;
// }

const Form: React.FC<parameters> = ({ videos, setVideos }): JSX.Element => { 
    
    const [input, setInput] = useState<videoType>({
        title: "",
        url: "",
        id: "",
        messages: []
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        
        if (!input.title || !input.url) {
            return; 
        }

        setVideos([
            ...videos,
            {
                title: input.title,
                url: input.url,
                id: input.id,
                messages: []
            }
        ])

        setInput({
            title: "",
            url: "",
            id: "",
            messages: []
        })
    }

    return (
        <div className="FormContainer">
            <input 
                type="text"
                placeholder="Title"
                name="title"
                value={input.title}
                onChange={handleChange}
            />
            <input
                type="text"
                placeholder="URL"
                name="url"
                value={input.url}
                onChange={handleChange}
            />
            <input
                placeholder="Enter ID"
                name="id"
                value={input.id}
                onChange={handleChange}
            />
            <button
                onClick={handleSubmit}
            >
                Submit
            </button>

        </div>
    )
}

export default Form;