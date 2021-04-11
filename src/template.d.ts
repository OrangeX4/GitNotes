export interface File {
    name: string
    parent: Folder
}


export interface Folder {
    name: string
    parent: Folder | null
    folders: Folder[] | ((folder: Folder, callback: (folders: Folder[], files: File[]) => void) => void)
    files: File[]
}