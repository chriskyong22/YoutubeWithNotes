export interface noteType {
    /* Can only use array types in DBSchema for some reason??
        Causes errors if I change it to an object with string values 
        The array is [timestamp, text, id]
    */
    note: [string, string, string]
}

export interface notesType {
    notes: noteType["note"][];
}