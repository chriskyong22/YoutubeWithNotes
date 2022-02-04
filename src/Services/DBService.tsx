import { openDB, DBSchema } from "idb";
import { videoType } from "../App";
import { messageType, messagesType } from "../Components/ChatboxContainer"

// TODO: Change the schema to include ID and Title
const DATABASE_NAME = `VIDEONOTESDB`
const tableName = `videosNotesTable`;
const DATABASE_VERSION = 1

export interface DbRow {
    'id': string;
    'url': string;
    'title': string;
    'notes': messagesType["messages"];
}

interface MyDB extends DBSchema {
    'videosNotesTable': {
        key: string;
        value: {
            'id': string;
            'url': string;
            'title': string;
            'notes': messagesType["messages"];
        };
        indexes: {
            'id': string;
            'url': string;
            'title': string;
            'notes': messagesType["messages"];
        }
    }
}

enum transactionModes {
    READONLY = "readonly",
    READWRITE = "readwrite"
}

const dbPromise = openDB<MyDB> (DATABASE_NAME, DATABASE_VERSION, {
    upgrade(oldDatabase, oldVersion, newVersion, transaction) {
        
        const primaryKey = `id`;
        // Creating the database & setting the primary key 
        let database = oldDatabase.createObjectStore(tableName, 
            { keyPath: primaryKey }
        )

        // Creating the columns
        database.createIndex(`id`, `id`, { unique: true });
        database.createIndex(`url`, `url`);
        database.createIndex(`title`, `title`);
        
        database.createIndex(`notes`, `notes`, {multiEntry: true})
        
    }
})

export const getKey = async (key: string) => {
    return dbPromise.then(db => {
        return db.transaction(tableName, transactionModes.READONLY).objectStore(tableName).get(key);
    }).catch((error) => {
        console.log(error);
    })
}

export const getAll = async () => {
    return dbPromise.then(db => {
        return db.transaction(tableName, transactionModes.READONLY).objectStore(tableName).getAll();
    }).catch((error) => {
        console.log(error);
    })
}

export const deleteKey = async (key: string) => {
    return dbPromise.then(db => {
        return db.transaction(tableName, transactionModes.READWRITE).objectStore(tableName).delete(key)
    }).catch((error) => {
        console.log(`[DELETE ERROR]: ${error}`)
    })
}

export const updateKey = async (video: videoType,  notes: messagesType["messages"]) => {    
    return dbPromise.then(db => {
        return db.transaction(tableName, transactionModes.READWRITE).objectStore(tableName).put({
            id: video.id,
            url: video.url,
            title: video.title,
            notes: notes
        });
    }).catch((error) => {
        console.log(`[UPDATE/INSERT ERROR]: ${error}`)
    })
}

export const append = async (video: videoType, newNote: messageType["message"]) => {
    let oldNotes = await getKey(video.id);
    if (oldNotes) {
        oldNotes.notes.push(newNote);
        updateKey(video, oldNotes.notes);
    } else {
        updateKey(video, [newNote]);
    }
}

export const databaseJSON = async () => {
    let databaseJSONIFIED = JSON.stringify(await getAll());
    return databaseJSONIFIED;
}