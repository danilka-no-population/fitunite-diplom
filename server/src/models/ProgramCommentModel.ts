import pool from '../config/db';

interface ProgramComment {
  id?: number;
  user_id: number;
  program_id: number;
  comment: string;
  created_at?: Date;
}

class ProgramCommentModel {
  // Добавить комментарий
//   static async addComment(comment: ProgramComment): Promise<ProgramComment> {
//     const { user_id, program_id, comment: commentText } = comment;
//     const result = await pool.query(
//       'INSERT INTO ProgramComments (user_id, program_id, comment) VALUES ($1, $2, $3) RETURNING *',
//       [user_id, program_id, commentText]
//     );
//     return result.rows[0];
//   }
static async addComment(comment: ProgramComment): Promise<any> {
    const { user_id, program_id, comment: commentText } = comment;
    const result = await pool.query(
      `INSERT INTO ProgramComments (user_id, program_id, comment) 
       VALUES ($1, $2, $3) 
       RETURNING *, (SELECT username FROM Users WHERE id = $1) as username`,
      [user_id, program_id, commentText]
    );
    return result.rows[0];
  }

  // Удалить комментарий
  static async deleteComment(comment_id: number, user_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM ProgramComments WHERE id = $1 AND user_id = $2',
      [comment_id, user_id]
    );
  }

  // Получить все комментарии для программы
  static async getCommentsByProgramId(program_id: number): Promise<ProgramComment[]> {
    const result = await pool.query(
      `SELECT pc.*, u.username 
       FROM ProgramComments pc
       JOIN Users u ON pc.user_id = u.id
       WHERE program_id = $1
       ORDER BY created_at DESC`,
      [program_id]
    );
    return result.rows;
  }
}

export default ProgramCommentModel;