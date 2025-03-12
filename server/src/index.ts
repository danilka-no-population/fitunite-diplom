import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FitUnite API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});