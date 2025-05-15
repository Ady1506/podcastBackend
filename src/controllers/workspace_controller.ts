import { Request, Response } from "express";
import { Workspace, Folder, File, WorkspaceFolder, WorkspaceFile, FolderFile, FolderFolder } from "../models/workspace_model.ts";
import {createWorkspace, createFolder, createFile, createWorkspaceFolder, createWorkspaceFile, createFolderFolder, createFolderFile} from "../models/workspace_model.ts";
import {findWorkspaceById,findFolderById,findFileById,findWorkspaceFoldersById,findWorkspaceFilesById,findFolderFoldersById,findFolderFilesById} from "../models/workspace_model.ts";
import { incrementWorkspaceCounter, decrementWorkspaceCounter, deleteWorkspace, deleteFolder, deleteFile } from "../models/workspace_model.ts";
import { verifyToken } from "utils/jwtUtils.ts";

interface FolderDetails{
    folder_id: number;
    folder_name: string;
    user_id: number;
    parent_id: number;
    parent_type: string;
    created_at: Date;
    folder_files: File[];
    folder_folders: FolderDetails[];
}

interface WorkspaceDetails{
    workspace_id: number;
    workspace_name: string;
    user_id: number;
    created_at: Date;
    workspace_folders: FolderDetails[];
    workspace_files: File[];
}

export const createWorkspaceController = async (req: Request, res: Response): Promise<void> => {
    try{
        const {name, created_at}= req.body;
        if(!name || !created_at){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        const token=req.cookies.jwt;
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        await incrementWorkspaceCounter(userId);

        const workspace: Workspace = {
            workspace_name: name,
            user_id: userId,
            created_at,
            
        };
        await createWorkspace(workspace);
        res.status(201).json({message: "Workspace created successfully"});

    }
    catch(error){
        console.error("Error creating workspace:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const createFolderController = async(req: Request, res: Response): Promise<void>=>{
    try{
        const{name, parent_id, parent_type, created_at}=req.body;
        if(!name || !parent_id || !parent_type || !created_at){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        if(parent_type!=='workspace' && parent_type!=='folder'){
            res.status(400).json({message: "Invalid parent type"});
            return;
        }
        const token=req.cookies.jwt;
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const folder: Folder = {
            folder_name: name,
            user_id: userId,
            parent_id,
            parent_type,
            created_at,
        };
        const newFolder = await createFolder(folder);
        if(!newFolder){
            res.status(500).json({message: "Error creating folder"});
            return;
        }
        if(parent_type === 'workspace') {
            const workspaceFolder: WorkspaceFolder = {
            workspace_id: parent_id,
            folder_id: newFolder.folder_id,
            };
            await createWorkspaceFolder(workspaceFolder);
        } else if(parent_type === 'folder') {
            const folderFolder: FolderFolder = {
            parent_folder_id: parent_id,
            child_folder_id: newFolder.folder_id,
            };
            await createFolderFolder(folderFolder);
        } else {
            res.status(400).json({ message: "Invalid parent type" });
            return;
        }
        res.status(201).json({ message: "Folder created successfully" });
    }
    catch(error){
        console.error("Error creating folder:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const createFileController = async(req: Request, res: Response): Promise<void>=>{
    try{
        const {name, parent_id, parent_type, created_at}=req.body;
        if(!name || !parent_id || !parent_type || !created_at){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        if(parent_type!=='workspace' && parent_type!=='folder'){
            res.status(400).json({message: "Invalid parent type"});
            return;
        }
        const token=req.cookies.jwt;
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const file: File = {
            file_name: name,
            user_id: userId,
            parent_id,
            parent_type,
            created_at,
        };
        const newFile = await createFile(file);
        if(!newFile){
            res.status(500).json({message: "Error creating file"});
            return;
        }
        if(parent_type === 'workspace') {
            const workspaceFile: WorkspaceFile = {
                workspace_id: parent_id,
                file_id: newFile.file_id,
            };
            await createWorkspaceFile(workspaceFile);
        } else if(parent_type === 'folder') {
            const folderFile: FolderFile = {
                folder_id: parent_id,
                file_id: newFile.file_id,
            };
            await createFolderFile(folderFile);
        } else {
            res.status(400).json({ message: "Invalid parent type" });
            return;
        }
        res.status(201).json({ message: "File created successfully" });
    }
    catch(error){
        console.error("Error creating file:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getFileById= async(req:Request, res:Response): Promise<void>=>{
    try{
        const{id}=req.body;
        if(!id){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        const token=req.cookies.jwt;
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const file= await findFileById(id);
        if(!file){
            res.status(404).json({message: "File not found"});
            return;
        }   
        if(file.user_id !== userId){
            res.status(403).json({message: "Forbidden"});
            return;
        }
        res.status(200).json({file});
    }
    catch(error){
        console.error("Error getting file by id:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getFolderById= async(req:Request, res:Response): Promise<void>=>{
    try{
        const {id}=req.body;
        if(!id){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        const token=req.cookies.jwt;
        if(!token){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const folder= await findFolderById(id);
        if(!folder){
            res.status(404).json({message: "Folder not found"});
            return;
        }
        if(folder.user_id !== userId){
            res.status(403).json({message: "Forbidden"});
            return;
        }
        const folderDetails= await getFoldersDetails(id);
        res.status(200).json(folderDetails);
    }
    catch(error){
        console.error("Error getting folder folders by id:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getFoldersDetails= async(parentId:number): Promise<FolderDetails>=>{
    try{
       const folder = await findFolderById(parentId);
        if (!folder) {
            throw new Error(`Folder with ID ${parentId} not found`);
        }
        const { folder_id, folder_name, user_id, parent_id, parent_type, created_at } = folder;
        const folderFiles= await findFolderFilesById(folder_id) ;
        const folderFolders= await findFolderFoldersById(folder_id);
        const folderDetails: FolderDetails = {
            folder_id,
            folder_name,
            user_id,
            parent_id,
            parent_type,
            created_at,
            folder_files: folderFiles,
            folder_folders: [],
        };
        for(const folder of folderFolders){
            const childFolderDetails= await getFoldersDetails(folder.child_folder_id);
            folderDetails.folder_folders.push(childFolderDetails);
        }
        return folderDetails;
    }
    catch(error){
        console.error("Error finding child of folders:", error);
        throw error;

    }
}

export const getWorkspaceById= async(req:Request, res:Response): Promise<void>=>{
    try{
        const {id}=req.body;
        if(!id){
            res.status(400).json({message: "Please provide all required fields"});
            return;
        }
        const token=req.cookies.jwt;
        if(!token){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const userId=verifyToken(token);
        if(!userId){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const workspace= await findWorkspaceById(id);
        if(!workspace){
            res.status(404).json({message: "Workspace not found"});
            return;
        }
        if(workspace.user_id !== userId){
            res.status(403).json({message: "Forbidden"});
            return;
        }
        const workspaceDetails= await getWorkspaceDetails(workspace);
        res.status(200).json(workspaceDetails);
    }
    catch(err){
        console.error("Error getting workspace by id:", err);
        res.status(500).json({message: "Internal server error"});
    }
}

const getWorkspaceDetails= async(workspace:Workspace): Promise<WorkspaceDetails>=>{
    try{
        const { workspace_id, workspace_name, user_id, created_at } = workspace;
        const workspaceFiles= await findWorkspaceFilesById(workspace_id) ;
        const workspaceFolders= await findWorkspaceFoldersById(workspace_id);
        const workspaceDetails: WorkspaceDetails = {
            workspace_id,
            workspace_name,
            user_id,
            created_at,
            workspace_folders: [],
            workspace_files: workspaceFiles,
        };
        for(const folder of workspaceFolders){
            const childFolderDetails= await getFoldersDetails(folder.folder_id);
            workspaceDetails.workspace_folders.push(childFolderDetails);
        }
        return workspaceDetails;
    }
    catch(error){
        console.error("Error finding child of folders:", error);
        throw error;

    }
}