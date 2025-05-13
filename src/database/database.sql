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
) 