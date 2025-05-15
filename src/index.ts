import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.ts';
import workspaceRoutes from './routes/workspace_routes.ts'
import db,{createUserTable, addWorkspace, addFolder, addFile, linkWorkspaceFolder, linkWorkspaceFile, linkFolderFolder, linkFolderFile} from './database/db.ts';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

createUserTable();
addWorkspace();
addFolder();
addFile();
linkWorkspaceFolder();
linkWorkspaceFile();
linkFolderFolder();
linkFolderFile();

app.use(cors({
    credentials: true,
    origin: '*'
}));


app.get('/', (req, res) => {
  res.send('Backend is running ');
});

app.use('/api/user', userRoutes);
app.use('api/workspace', workspaceRoutes);

app.listen(PORT, async() => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await db.connect();
    } catch (error) {
        console.error('Database connection error:', error);
    }
  }
);
