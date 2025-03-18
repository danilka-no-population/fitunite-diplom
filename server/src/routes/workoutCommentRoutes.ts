import express from 'express';
import WorkoutCommentController from '../controllers/workoutCommentController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
//@ts-ignore
router.post('/', roleMiddleware('trainer'), WorkoutCommentController.createComment);
router.get('/:workout_id', WorkoutCommentController.getComments);

export default router;