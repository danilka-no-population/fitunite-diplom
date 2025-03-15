import pool from '../config/db';

interface ProgramLike {
  id?: number;
  user_id: number;
  program_id: number;
}

class ProgramLikeModel {
  // Поставить лайк
  static async likeProgram(user_id: number, program_id: number): Promise<ProgramLike> {
    const result = await pool.query(
      'INSERT INTO ProgramLikes (user_id, program_id) VALUES ($1, $2) RETURNING *',
      [user_id, program_id]
    );
    return result.rows[0];
  }

  // Убрать лайк
  static async unlikeProgram(user_id: number, program_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM ProgramLikes WHERE user_id = $1 AND program_id = $2',
      [user_id, program_id]
    );
  }

  // Проверить, поставил ли пользователь лайк
  static async isLiked(user_id: number, program_id: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT * FROM ProgramLikes WHERE user_id = $1 AND program_id = $2',
      [user_id, program_id]
    );
    return result.rows.length > 0;
  }

  // Получить количество лайков
//   static async getLikesCount(program_id: number): Promise<number> {
//     const result = await pool.query(
//       'SELECT COUNT(*) FROM ProgramLikes WHERE program_id = $1',
//       [program_id]
//     );
//     return parseInt(result.rows[0].count);
//   }
static async getLikesCount(program_id: number): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM ProgramLikes WHERE program_id = $1',
      [program_id]
    );
    return parseInt(result.rows[0].count);
  }
}

export default ProgramLikeModel;