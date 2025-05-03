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
// Добавим новые маршруты
//@ts-ignore
router.post('/assign', authMiddleware, roleMiddleware('trainer'), WorkoutController.assignWorkout);
//@ts-ignore
router.put('/:workout_id/status', authMiddleware, WorkoutController.updateWorkoutStatus);
//@ts-ignore
router.get('/assigned/my', authMiddleware, WorkoutController.getAssignedWorkouts);

export default router;