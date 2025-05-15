import client from "../database/db.ts";

export interface Workspace {
    workspace_id?: number;
    user_id?: number;
    workspace_name?: string;
    created_at?: Date;
}

export interface Folder {
    folder_id?: number;
    folder_name?: string;
    user_id?: number;
    parent_id?: number;
    parent_type?: string;
    created_at?: Date;
}

export interface File {
    file_id?: number;
    file_name?: string;
    user_id?: number;
    parent_id?: number;
    parent_type?: string;
    created_at?: Date;
}

export interface WorkspaceFile {
    workspace_id?: number;
    file_id?: number;
}

export interface WorkspaceFolder {
    workspace_id?: number;
    folder_id?: number;
}

export interface FolderFile {
    folder_id?: number;
    file_id?: number;
}

export interface FolderFolder {
    parent_folder_id?: number;
    child_folder_id?: number;
}


export const createWorkspace= async(workspace: Workspace): Promise<Workspace>=>{
    try{
        const {user_id, workspace_name,created_at}=workspace;
        const query=`
            INSERT INTO workspace (user_id, workspace_name, created_at)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values=[user_id, workspace_name, created_at];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating workspace: ",error);
        throw new Error('Error creating workspace');
    }
}

export const incrementWorkspaceCounter= async(userId: number): Promise<void>=>{
    try{
        const query=`
            UPDATE users
            SET workspace_counter = workspace_counter + 1
            WHERE user_id = $1;
        `;
        await client.query(query,[userId]);
    }
    catch(error){
        console.log("error incrementing workspace counter: ",error);
        throw new Error('Maximum workspace limit reached');
    }
}

export const decrementWorkspaceCounter= async(userId: number): Promise<void>=>{
    try{
        const query=`
            UPDATE users
            SET workspace_counter = workspace_counter - 1
            WHERE user_id = $1;
        `;
        await client.query(query,[userId]);
    }
    catch(error){
        console.log("error decrementing workspace counter: ",error);
        throw new Error('Error decrementing workspace counter');
    }
}

export const deleteWorkspace= async(workspaceId: number): Promise<void>=>{
    try{
        const query=`
            DELETE FROM workspace WHERE workspace_id = $1;
        `;
        await client.query(query,[workspaceId]);
    }
    catch(error){
        console.log("error deleting workspace: ",error);
        throw new Error('Error deleting workspace');
    }
}

export const findWorkspaceById= async(workspaceId: number): Promise<Workspace | null>=>{
    try{
        const query=`
            SELECT * FROM workspace WHERE workspace_id = $1;
        `;
        const result= await client.query(query,[workspaceId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting workspace by id: ",error);
        throw new Error('Error getting workspace by id');
    }
}

export const createFolder= async(folder: Folder): Promise<Folder>=>{
    try{
        const { folder_name,user_id, parent_id, parent_type, created_at}=folder;
        const query=`
            INSERT INTO folder (folder_name,user_id, parent_id, parent_type, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values=[ folder_name,user_id, parent_id, parent_type,created_at];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating folder: ",error);
        throw new Error('Error creating folder');
    }
}

export const deleteFolder= async(folderId: number): Promise<void>=>{
    try{
        const query=`
            DELETE FROM folder WHERE folder_id = $1;
        `;
        await client.query(query,[folderId]);
    }
    catch(error){
        console.log("error deleting folder: ",error);
        throw new Error('Error deleting folder');
    }
}

export const findFolderById= async(folderId: number): Promise<Folder | null>=>{
    try{
        const query=`
            SELECT * FROM folder WHERE folder_id = $1;
        `;
        const result= await client.query(query,[folderId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting folder by id: ",error);
        throw new Error('Error getting folder by id');
    }
}

export const createFile= async(file: File): Promise<File>=>{
    try{
        const { file_name,user_id, parent_id, parent_type, created_at}=file;
        const query=`
            INSERT INTO file ( file_name,user_id, parent_id, parent_type, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values=[ file_name,user_id, parent_id, parent_type, created_at];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating file: ",error);
        throw new Error('Error creating file');
    }
}

export const deleteFile= async(fileId: number): Promise<void>=>{
    try{
        const query=`
            DELETE FROM file WHERE file_id = $1;
        `;
        await client.query(query,[fileId]);
    }
    catch(error){
        console.log("error deleting file: ",error);
        throw new Error('Error deleting file');
    }
}

export const findFileById= async(fileId: number): Promise<File | null>=>{
    try{
        const query=`
            SELECT * FROM file WHERE file_id = $1;
        `;
        const result= await client.query(query,[fileId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting file by id: ",error);
        throw new Error('Error getting file by id');
    }
}

export const createWorkspaceFile= async(workspaceFile: WorkspaceFile): Promise<WorkspaceFile>=>{
    try{
        const { workspace_id, file_id}=workspaceFile;
        const query=`
            INSERT INTO workspace_file (workspace_id, file_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values=[ workspace_id, file_id];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating workspace file: ",error);
        throw new Error('Error creating workspace file');
    }
}

export const findWorkspaceFilesById= async(workspaceId: number): Promise<WorkspaceFile[] | []>=>{
    try{
        const query=`
            SELECT * FROM workspace_file WHERE workspace_id = $1;
        `;
        const result= await client.query(query,[workspaceId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting workspace file by id: ",error);
        throw new Error('Error getting workspace file by id');
    }
}

export const createWorkspaceFolder= async(workspaceFolder: WorkspaceFolder): Promise<WorkspaceFolder>=>{
    try{
        const { workspace_id, folder_id}=workspaceFolder;
        const query=`
            INSERT INTO workspace_folder (workspace_id, folder_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values=[ workspace_id, folder_id];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating workspace folder: ",error);
        throw new Error('Error creating workspace folder');
    }
}

export const findWorkspaceFoldersById= async(workspaceId: number): Promise<WorkspaceFolder[] | []>=>{
    try{
        const query=`
            SELECT * FROM workspace_folder WHERE workspace_id = $1;
        `;
        const result= await client.query(query,[workspaceId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting workspace folder by id: ",error);
        throw new Error('Error getting workspace folder by id');
    }
}

export const createFolderFile= async(folderFile: FolderFile): Promise<FolderFile>=>{
    try{
        const { folder_id, file_id}=folderFile;
        const query=`
            INSERT INTO folder_file (folder_id, file_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values=[ folder_id, file_id];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating folder file: ",error);
        throw new Error('Error creating folder file');
    }
}

export const findFolderFilesById= async(folderId: number): Promise<FolderFile[] | []>=>{
    try{
        const query=`
            SELECT * FROM folder_file WHERE folder_id = $1;
        `;
        const result= await client.query(query,[folderId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting folder file by id: ",error);
        throw new Error('Error getting folder file by id');
    }
}

export const createFolderFolder= async(folderFolder: FolderFolder): Promise<FolderFolder>=>{
    try{
        const { parent_folder_id, child_folder_id}=folderFolder;
        const query=`
            INSERT INTO folder_folder (parent_folder_id, child_folder_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values=[ parent_folder_id, child_folder_id];
        const result= await client.query(query, values);
        return result.rows[0];
    }
    catch(error){
        console.log("error creating folder folder: ",error);
        throw new Error('Error creating folder folder');
    }
}

export const findFolderFoldersById= async(parentId: number): Promise<FolderFolder[] | []>=>{
    try{
        const query=`
            SELECT * FROM folder_folder WHERE parent_folder_id = $1;
        `;
        const result= await client.query(query,[parentId]);
        return result.rows.length>0 ? result.rows[0] : null;
    }
    catch(error){
        console.log("error getting folder folder by id: ",error);
        throw new Error('Error getting folder folder by id');
    }
}