import { Request, Response } from 'express';
import MealModel from '../models/Meal';

class MealController {
  // Создание записи о питании
  static async createMeal(req: Request, res: Response) {
    const { date } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const newMeal = await MealModel.create({
        user_id,
        date,
      });

      res.status(201).json(newMeal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Добавление продукта к записи о питании
  static async addProduct(req: Request, res: Response) {
    const { meal_id, product_id, quantity, meal_type } = req.body;

    try {
      const newProduct = await MealModel.addProduct({
        meal_id,
        product_id,
        quantity,
        meal_type,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение всех записей о питании пользователя
  static async getMeals(req: Request, res: Response) {
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const meals = await MealModel.findByUserId(user_id);
      res.status(200).json(meals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение продуктов для конкретной записи о питании
  static async getMealProducts(req: Request, res: Response) {
    const { meal_id } = req.params;
  
    try {
      const products = await MealModel.findProductsByMealId(Number(meal_id));
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default MealController;