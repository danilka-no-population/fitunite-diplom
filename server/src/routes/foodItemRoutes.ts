import express from 'express';
import FoodItemController from '../controllers/foodItemController';

const router = express.Router();

// Получение всех продуктов
router.get('/', FoodItemController.getFoodItems);

export default router;