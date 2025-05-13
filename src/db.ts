import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

client.on('connect', () => {
  console.log('Connected to the database');
}
);


export default client