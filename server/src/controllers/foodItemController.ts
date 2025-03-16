import { Request, Response } from 'express';
import FoodItemModel from '../models/FoodItem';

class FoodItemController {
  // Получение всех продуктов
  static async getFoodItems(req: Request, res: Response) {
    try {
      const foodItems = await FoodItemModel.findAll();
      res.status(200).json(foodItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default FoodItemController;