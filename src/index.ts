import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running ');
});

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    }
);

