import express from 'express';
import WorkoutController from '../controllers/workoutController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', WorkoutController.createWorkout);
router.post('/exercises', WorkoutController.addExercise);
router.get('/', WorkoutController.getWorkouts);
router.get('/:workout_id/exercises', WorkoutController.getWorkoutExercises);

export default router;