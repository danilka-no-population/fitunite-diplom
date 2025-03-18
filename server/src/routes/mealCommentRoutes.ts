import express from 'express';
import MealCommentController from '../controllers/mealCommentController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);

//@ts-ignore
router.post('/', roleMiddleware('trainer'), MealCommentController.createComment);
router.get('/:meal_id', MealCommentController.getComments);

export default router;