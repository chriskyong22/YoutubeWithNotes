import { openDB, DBSchema } from "idb";
import { messageType, messagesType } from "../Components/Card"

const DATABASE_NAME = `VIDEONOTESDB`
const tableName = `videosNotesTable`;
const DATABASE_VERSION = 1

interface MyDB extends DBSchema {
    'videosNotesTable': {
        key: string;
        value: {
            'url': string;
            'notes': messagesType["messages"];
        };
        indexes: {
            'url': string;
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
        
        const primaryKey = `url`;
        // Creating the database & setting the primary key 
        let database = oldDatabase.createObjectStore(tableName, 
            { keyPath: primaryKey }
        )

        // Creating the columns
        database.createIndex(`url`, `url`, {unique: true});
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

export const updateKey = async (key: string, notes: messagesType["messages"]) => {    
    return dbPromise.then(db => {
        return db.transaction(tableName, transactionModes.READWRITE).objectStore(tableName).put({notes: notes, url: key});
    }).catch((error) => {
        console.log(`[UPDATE/INSERT ERROR]: ${error}`)
    })
}

export const append = async (key: string, newNote: messageType["message"]) => {
    let oldNotes = await getKey(key);
    if (oldNotes) {
        oldNotes.notes.push(newNote);
        updateKey(key, oldNotes.notes);
    } else {
        updateKey(key, [newNote]);
    }
}