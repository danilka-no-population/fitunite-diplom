import pool from '../config/db';

interface MealComment {
  id?: number;
  meal_id: number;
  trainer_id: number;
  comment: string;
  created_at?: Date;
}

class MealCommentModel {
  static async create(comment: MealComment): Promise<MealComment> {
    const { meal_id, trainer_id, comment: commentText } = comment;

    const result = await pool.query(
      'INSERT INTO MealComments (meal_id, trainer_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [meal_id, trainer_id, commentText]
    );

    return result.rows[0];
  }

  static async findByMealId(meal_id: number): Promise<MealComment[]> {
    const result = await pool.query('SELECT * FROM MealComments WHERE meal_id = $1', [meal_id]);
    return result.rows;
  }
}

export default MealCommentModel;