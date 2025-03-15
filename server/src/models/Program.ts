import pool from '../config/db';

interface Program {
  id?: number;
  name: string;
  description: string;
  author_id: number;
  created_at?: Date;
}

class ProgramModel {
  // Получение всех программ тренировок
  static async findAll(): Promise<Program[]> {
    const result = await pool.query('SELECT * FROM Programs');
    return result.rows;
  }

  // Получение программы тренировок по ID
  // static async findById(id: number): Promise<Program | null> {
  //   const result = await pool.query('SELECT * FROM Programs WHERE id = $1', [id]);
  //   return result.rows[0] || null;
  // }
  static async findById(id: number): Promise<any> {
    const result = await pool.query(
      `SELECT p.*, u.username as author_username 
       FROM Programs p
       JOIN Users u ON p.author_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Создание новой программы тренировок
  static async create(program: Program): Promise<Program> {
    const { name, description, author_id } = program;
    const result = await pool.query(
      'INSERT INTO Programs (name, description, author_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, author_id]
    );
    return result.rows[0];
  }
}

export default ProgramModel;