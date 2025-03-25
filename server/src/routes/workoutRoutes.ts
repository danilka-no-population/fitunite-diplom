import express from 'express';
import WorkoutController from '../controllers/workoutController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', WorkoutController.createWorkout);
router.post('/exercises', WorkoutController.addExercise);
router.get('/', WorkoutController.getWorkouts);
router.get('/:workout_id/exercises', WorkoutController.getWorkoutExercises);
//@ts-ignore
router.get('/client/:client_id', roleMiddleware('trainer'), WorkoutController.getClientWorkouts);

export default router;