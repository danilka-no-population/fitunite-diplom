import express from 'express';
import ExerciseController from '../controllers/exerciseController';

const router = express.Router();

// Получение всех упражнений
router.get('/', ExerciseController.getExercises);

export default router;