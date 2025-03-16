import pool from '../config/db';

interface Meal {
  id?: number;
  user_id: number;
  date: Date;
}

interface MealProduct {
  id?: number;
  meal_id: number;
  product_id: number;
  quantity: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
}

class MealModel {
  // Создание записи о питании
  static async create(meal: Meal): Promise<Meal> {
    const { user_id, date } = meal;

    const result = await pool.query(
      'INSERT INTO Meals (user_id, date) VALUES ($1, $2) RETURNING *',
      [user_id, date]
    );

    return result.rows[0];
  }

  // Добавление продукта к записи о питании
  static async addProduct(product: MealProduct): Promise<MealProduct> {
    const { meal_id, product_id, quantity, meal_type } = product;

    const result = await pool.query(
      'INSERT INTO MealProducts (meal_id, product_id, quantity, meal_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [meal_id, product_id, quantity, meal_type]
    );

    return result.rows[0];
  }

  // Получение всех записей о питании пользователя
  static async findByUserId(user_id: number): Promise<Meal[]> {
    const result = await pool.query('SELECT * FROM Meals WHERE user_id = $1', [user_id]);
    return result.rows;
  }

  // Получение продуктов для конкретной записи о питании
  static async findProductsByMealId(meal_id: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT mp.*, fi.name, fi.category, fi.calories_per_100, fi.proteins_per_100, fi.fats_per_100, fi.carbs_per_100 
       FROM MealProducts mp
       JOIN FoodItems fi ON mp.product_id = fi.id
       WHERE mp.meal_id = $1`,
      [meal_id]
    );
    return result.rows;
  }
}

export default MealModel;