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
        verified BOOLEAN DEFAULT FALSE
      );
    `;
    await client.query(query);
    console.log('User table created or already exists');
  } catch (error) {
    console.error('Error creating user table:', error);
  }
}

export default client