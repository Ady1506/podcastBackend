import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

client.on('connect', () => {
  console.log('Connected to the database');
}
);

export const createUserTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL UNIQUE,
        account_type VARCHAR(10) NOT NULL CHECK (account_type IN ('free', 'premium')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verification_code VARCHAR(6),
        verified BOOLEAN DEFAULT FALSE,
        workspace_counter INTEGER DEFAULT 0 CHECK(account_type = 'free' AND workspace_counter <= 1 OR account_type = 'premium' AND workspace_counter <= 3)))`;
    await client.query(query);
    console.log('User table created or already exists');
  } catch (error) {
    console.error('Error creating user table:', error);
  }
}

export const addWorkspace= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS workspace(
    workspace_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    workspace_name VARCHAR(255) NOT NULL),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,`
    await client.query(query);
    console.log('Workspace table created or already exists');
  }
  catch(error){
    console.error('Error creating workspace table:', error);
  }
}

export const addFolder= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS folder(
    folder_id SERIAL PRIMARY KEY,
    folder_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users (user_id),
    parent_id INTEGER NOT NULL ,
    parent_type VARCHAR(15) NOT NULL CHECK(parent_type IN ('workspace','folder')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,)`
    await client.query(query);
    console.log('Folder table created or already exists');
  }
  catch(error){
    console.error('Error creating folder table:', error);
  }
}

export const addFile= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS file(
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users (user_id),
    parent_id INTEGER NOT NULL,
    parent_type VARCHAR(15) NOT NULL CHECK(parent_type IN ('workspace','folder')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,)`
    await client.query(query);
    console.log('File table created or already exists');
  }
  catch(error){
    console.error('Error creating file table:', error);
  }
}

export const linkWorkspaceFile= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS workspace_file(
    workspace_id INTEGER REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES file(file_id) ON DELETE CASCADE,
    PRIMARY KEY(workspace_id,file_id))`
    await client.query(query);
    console.log('Workspace file table created or already exists');
  }
  catch(error){
    console.error('Error creating workspace file table:', error);
  }
}

export const linkWorkspaceFolder= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS workspace_folder(
    workspace_id INTEGER REFERENCES workspace(workspace_id) ON DELETE CASCADE,
    folder_id INTEGER REFERENCES folder(folder_id) ON DELETE CASCADE,
    PRIMARY KEY(workspace_id,folder_id))`
    await client.query(query);
    console.log('Workspace folder table created or already exists');
  }
  catch(error){
    console.error('Error creating workspace folder table:', error);
  }
}

export const linkFolderFile= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS folder_file(
    folder_id INTEGER REFERENCES folder(folder_id) ON DELETE CASCADE,
    file_id INTEGER REFERENCES file(file_id) ON DELETE CASCADE,
    PRIMARY KEY(folder_id,file_id))`
    await client.query(query);
    console.log('Folder file table created or already exists');
  }
  catch(error){
    console.error('Error creating folder file table:', error);
  }
}

export const linkFolderFolder= async()=>{
  try{
    const query=`
    CREATE TABLE IF NOT EXISTS folder_folder(
    parent_id INTEGER REFERENCES folder(folder_id) ON DELETE CASCADE,
    child_id INTEGER REFERENCES folder(folder_id) ON DELETE CASCADE,
    PRIMARY KEY(parent_id,child_id))`
    await client.query(query);
    console.log('Folder folder table created or already exists');
  }
  catch(error){
    console.error('Error creating folder folder table:', error);
  }
}

export default client