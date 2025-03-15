import pool from '../config/db';

interface Favorite {
  id?: number;
  user_id: number;
  program_id: number;
}

class FavoriteModel {
  // Добавить в избранное
  static async addFavorite(user_id: number, program_id: number): Promise<Favorite> {
    const result = await pool.query(
      'INSERT INTO Favorites (user_id, program_id) VALUES ($1, $2) RETURNING *',
      [user_id, program_id]
    );
    return result.rows[0];
  }

  // Удалить из избранного
  static async removeFavorite(user_id: number, program_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM Favorites WHERE user_id = $1 AND program_id = $2',
      [user_id, program_id]
    );
  }

  // Проверить, добавлено ли в избранное
  static async isFavorite(user_id: number, program_id: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT * FROM Favorites WHERE user_id = $1 AND program_id = $2',
      [user_id, program_id]
    );
    return result.rows.length > 0;
  }

  // Получить избранное пользователя
  static async getFavoritesByUserId(user_id: number): Promise<Favorite[]> {
    const result = await pool.query(
      `SELECT f.*, p.name, p.description 
       FROM Favorites f
       JOIN Programs p ON f.program_id = p.id
       WHERE user_id = $1`,
      [user_id]
    );
    return result.rows;
  }
}

export default FavoriteModel;