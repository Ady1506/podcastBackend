import {Router} from 'express';
import { createWorkspaceController, createFolderController, createFileController, getWorkspaceById, getFolderById, getFileById } from 'controllers/workspace_controller.ts';

const router= Router();

router.post('/create-workspace',createWorkspaceController);
router.post('/create-folder',createFolderController);
router.post('/create-file',createFileController);
router.get('/workspace-details',getWorkspaceById);
router.get('/folder-details',getFolderById);
router.get('/file-details',getFileById);

export default router;