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
    workspace_counter INTEGER DEFAULT 0 CHECK(
      account_type='free' AND workspace_counter <=1 
      OR account_type='premium' AND workspace_counter <= 3
    )
) 

CREATE TABLE IF NOT EXISTS workspace{
  workspace_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (user_id),
  workspace_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
}

CREATE TABLE IF NOT EXISTS folder{
  folder_id SERIAL PRIMARY KEY,
  folder_name VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users (user_id),
  parent_id INTEGER NOT NULL,
  parent_type VARCHAR(15) NOT NULL CHECK(parent_type IN ('workspace','folder')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
}

CREATE TABLE IF NOT EXISTS file{
  file_id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users (user_id),
  parent_id INTEGER NOT NULL,
  parent_type VARCHAR(15) NOT NULL CHECK(parent_type IN ('workspace','folder')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
}

CREATE TABLE IF NOT EXISTS workspace_folder{
  workspace_id INTEGER NOT NULL REFERENCES workspace (workspace_id),
  folder_id INTEGER NOT NULL REFERENCES folder (folder_id),
  PRIMARY KEY (workspace_id, folder_id)
}

CREATE TABLE IF NOT EXISTS workspace_file{
  workspace_id INTEGER NOT NULL REFERENCES workspace (workspace_id),
  file_id INTEGER NOT NULL REFERENCES files (file_id),
  PRIMARY KEY (workspace_id, file_id)
}

CREATE TABLE IF NOT EXISTS folder_file{
  folder_id INTEGER NOT NULL REFERENCES folder (folder_id),
  file_id INTEGER NOT NULL REFERENCES files (file_id),
  PRIMARY KEY (folder_id, file_id)
}

CREATE TABLE IF NOT EXISTS folder_folder{
  parent_folder_id INTEGER NOT NULL REFERENCES folder (folder_id),
  child_folder_id INTEGER NOT NULL REFERENCES folder (folder_id),
  PRIMARY KEY (parent_folder_id, child_folder_id)
}