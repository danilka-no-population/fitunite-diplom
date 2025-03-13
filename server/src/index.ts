import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db';
import authRoutes from './routes/authRoutes';
import workoutRoutes from './routes/workoutRoutes';
import mealRoutes from './routes/mealRoutes';
import progressRoutes from './routes/progressRoutes';
import profileRoutes from './routes/profileRoutes';
import foodItemRoutes from './routes/foodItemRoutes';
import exerciseRoutes from './routes/exerciseRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/exercises', exerciseRoutes);

app.get('/', (req, res) => {
    res.send('FitUnite API is running...');
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});