import { messagesType } from "../Components/ChatboxContainer";
import { getKey } from "../Services/DBService";
import { DbRow } from "../Services/DBService"

interface sameType<S> {
    (value: S): S;
}

interface twoTypes<I, O> {
    (input: I): O;
}

const enum secondConversions {
    hour = 3600,
    minute = 60,
    millisecond = 1000
}

const enum mimeTypes {
    JSON = 'application/json',
}

/**
 * Return a HH-MM-SS or a MM-SS timestamp,
 * depending if the seconds are more than an hour.
 * @param seconds the seconds
 * @returns HH-MM-SS or MM-SS timestamp
 */
export const getTimestamp: twoTypes<number, string> = (seconds) => {
    // console.log(seconds);
    if (seconds < secondConversions.hour) {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(14, 5);
    } else {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(11, 8);
    }
}


export const createJSONFromObjectStore = (messages: void | {
    url: string;
    notes: [string, string][];
} | undefined): string => {
    if (messages) {
        return JSON.stringify(messages);
    }
    return JSON.stringify({});
}

export const createBlobFromJSON = (JSON: string): Blob => {
    return new Blob([JSON], {type: mimeTypes.JSON});
}

/**
 * Creates an anchor tag to download the file 
 * (uses download attribute of anchor element)
 * @param blob 
 * @param fileName 
 */
export const downloadBlob = (blob: Blob | MediaSource, fileName: string): void => {
    // Setup
    let anchor = document.createElement('a');
    let url = URL.createObjectURL(blob);
    anchor.setAttribute('download', fileName);
    anchor.setAttribute('href', url);
    
    // Initiate Download
    anchor.click();
    // Cleanup
    URL.revokeObjectURL(url);
}

/**
 * Allows the user to download the key.
 * TODO: convert to streaming instead of blob for 
 * performance improvements 
 * @param key the URL to search in the DB
 */
export const exportKey = (key: string): void => {
    let fileName = key.split('?')[0].split('/').at(-1);
    getKey(key).then((messages) => {
        return createJSONFromObjectStore(messages);
    }).then((stringifiedObjectStore) => {
        return createBlobFromJSON(stringifiedObjectStore);
    }).then((objectStoreBlob) => {
        downloadBlob(objectStoreBlob, fileName ? fileName + '.json' : 'temp.json');
    }).catch((error) => {
        console.log(`[EXPORT KEY ERROR]: ${error}`)
    })
}

export const importKey = (callback: (fileList: DbRow) => void): void => {
    let fileElement = document.createElement('input');
    fileElement.setAttribute('type', 'file');
    fileElement.onchange = async (event) => {
        const selectedFile = fileElement.files;
        if (selectedFile && selectedFile[0].type === mimeTypes.JSON) {
            let text = await selectedFile[0].text();
            let object: DbRow = JSON.parse(text);
            // For further safety, we can check the type of each 
            // element in the 'notes' property to ensure it is
            // a string array with two values.
            if (object.hasOwnProperty('notes') && 
                object.hasOwnProperty('url')) {
                callback(object);
            }
        }
    }
    fileElement.click();
}

export const copyToClipboard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    navigator.clipboard.writeText(event.currentTarget.innerHTML).catch((error) => {
        console.log(`[COPY TO CLIPBOARD ERROR] ${error}`)
    })
}