import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.ts';
import db,{createUserTable} from './database/db.ts';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

createUserTable();

app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running ');
});

app.use('/api/user', userRoutes);

app.listen(PORT, async() => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await db.connect();
    } catch (error) {
        console.error('Database connection error:', error);
    }
  }
);
