import express from 'express';
import MealController from '../controllers/mealController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', MealController.createMeal);
router.post('/products', MealController.addProduct);
router.get('/', MealController.getMeals);
router.get('/:meal_id/products', MealController.getMealProducts);

// Новый маршрут для получения записей о питании клиента тренером
//@ts-ignore
router.get('/client/:user_id', roleMiddleware('trainer'), MealController.getClientMeals);

export default router;