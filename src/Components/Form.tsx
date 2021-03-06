import React, { useState } from "react"
import { videoType, videosType} from "../Models/Video"
import { v4 as uuidv4 } from 'uuid';

interface parameters {
    setVideos: React.Dispatch<React.SetStateAction<videoType[]>>;
}

interface inputType {
    title: string;
    url: string;
}

const Form: React.FC<parameters> = ({ setVideos }): JSX.Element => { 
    
    const [input, setInput] = useState<inputType>({
        title: "",
        url: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        
        if (!input.title ||
                !input.url ||
                input.url.indexOf('youtube') == -1 ||
                input.url.indexOf('=') == -1) {
            return; 
        }

        setVideos((oldVideos) => [
            ...oldVideos,
            {
                title: input.title,
                url: input.url,
                id: uuidv4()
            }
        ])

        setInput({
            title: "",
            url: "",
        })
    }


    const [showFormCSS, setShowFormCSS] = useState({
        display: 'none'
    })

    const showForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setShowFormCSS({
            display: 'block'
        })
    }

    const closeForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        setShowFormCSS({
            display: 'none'
        })
    }

    return (
        <>
            <button className="OpenFormBtn" onClick={showForm}>
                Add Video
            </button>
            <div className="FormPopup" style={showFormCSS}>
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
                    <button
                        className="FormSubmit"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="FormCancel"
                        onClick={closeForm}
                    >
                        Close
                    </button>
                </div>  
            </div>
        </>
    )
}

export default Form;