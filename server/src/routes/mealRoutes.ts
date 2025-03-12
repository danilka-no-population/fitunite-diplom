import express from 'express';
import MealController from '../controllers/mealController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', MealController.createMeal);
router.post('/products', MealController.addProduct);
router.get('/', MealController.getMeals);
router.get('/:meal_id/products', MealController.getProducts);

export default router;