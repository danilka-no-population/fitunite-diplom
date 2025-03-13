import pool from '../config/db';

interface FoodItem {
  id?: number;
  name: string;
  category: string;
  calories_per_100: number;
  proteins_per_100: number;
  fats_per_100: number;
  carbs_per_100: number;
}

class FoodItemModel {
  // Получение всех продуктов
  static async findAll(): Promise<FoodItem[]> {
    const result = await pool.query('SELECT * FROM FoodItems');
    return result.rows;
  }
}

export default FoodItemModel;