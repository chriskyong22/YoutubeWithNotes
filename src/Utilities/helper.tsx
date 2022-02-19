import { notesType } from "../Models/Note";
import { getAll, getKey } from "../Services/DBService";
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

export const enum mimeTypes {
    JSON = 'application/json',
}

/**
 * Return a HH-MM-SS or a MM-SS timestamp,
 * depending if the seconds are more than an hour.
 * @param seconds the seconds
 * @returns HH-MM-SS or MM-SS timestamp
 */
export const getTimestamp: twoTypes<number, string> = (seconds) => {
    console.log(seconds);
    if (seconds < secondConversions.hour) {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(14, 5);
    } else {
        return new Date(seconds * secondConversions.millisecond).toISOString().substr(11, 8);
    }
}


export const createJSONFromObjectStore = (messages: void | {
    id: string;
    url: string;
    title: string;
    notes: notesType["notes"];
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
export const exportKey = (key: string, url: string): void => {
    let fileName = url.split('=')[1];
    getKey(key).then((messages) => {
        return createJSONFromObjectStore(messages);
    }).then((stringifiedObjectStore) => {
        return createBlobFromJSON(stringifiedObjectStore);
    }).then((objectStoreBlob) => {
        downloadBlob(objectStoreBlob, fileName ? fileName + '.json' : 'temp.json');
    }).catch((error) => {
        console.error(`[EXPORT KEY ERROR]: ${error}`)
    })
}

const openFilePopUp = (callback: (files: FileList) => Promise<void> | void): void => {
    let fileElement = document.createElement('input');
    fileElement.setAttribute('type', 'file');
    fileElement.onchange = (event) => {
        const selectedFiles = fileElement.files;
        if (selectedFiles) { 
            callback(selectedFiles);
        }
    }
    fileElement.click();
}

export const importKey = (callback: (fileList: FileList) => void): void => {
    openFilePopUp(callback);
}

export const exportDatabase = () => {
    getAll().then((rows) => {
        return JSON.stringify(rows);
    }).then((stringifiedRows) => {
        return createBlobFromJSON(stringifiedRows);
    }).then((rowsBlob) => {
        downloadBlob(rowsBlob, 'notesDatabase.json')
    }).catch((error) => {
        console.error(`[EXPORT DATABASE ERROR]: ${error}`)
    })
}

export const importDatabase = (callback: (fileList: FileList) => void): void => {
    openFilePopUp(callback);
}


export const copyToClipboard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    navigator.clipboard.writeText(event.currentTarget.innerHTML).catch((error) => {
        console.error(`[COPY TO CLIPBOARD ERROR] ${error}`)
    })
}

export const convertToValidURL = (url: string): string => {
    const YOUTUBE_EMBED_BASE_URL = 'https://www.youtube.com/embed/'
    const enableJSAPI = '?enablejsapi=1';
    const YOUTUBE_ID = url.split('=')[1];
    return `${YOUTUBE_EMBED_BASE_URL}${YOUTUBE_ID}${enableJSAPI}`
}

export const getAllStoredVideos = async (): Promise<DbRow[]> => {
    let DbRows: (DbRow[] | void) = await getAll();
    return DbRows || [];
}

