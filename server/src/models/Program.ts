import pool from '../config/db';

interface Program {
  id?: number;
  name: string;
  type: 'weight_loss' | 'health' | 'strength' | 'endurance' | 'core_strength' | 'combined';
  days_count: number;
  workouts_count: number;
  description?: string;
  author_id: number;
  is_public: boolean;
  created_at?: Date;
}

interface ProgramWorkout {
  id?: number;
  program_id: number;
  workout_id: number;
}

class ProgramModel {
  // Получение всех публичных программ тренировок
  static async findAllPublic(): Promise<Program[]> {
    const result = await pool.query('SELECT * FROM Programs WHERE is_public = true');
    return result.rows;
  }

  // Получение программ тренировок тренера
  static async findByAuthor(author_id: number): Promise<Program[]> {
    const result = await pool.query('SELECT * FROM Programs WHERE author_id = $1', [author_id]);
    return result.rows;
  }

  // Получение программы тренировок по ID
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
    const { name, type, days_count, workouts_count, description, author_id, is_public } = program;
    
    const result = await pool.query(
      `INSERT INTO Programs 
       (name, type, days_count, workouts_count, description, author_id, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, type, days_count, workouts_count, description, author_id, is_public]
    );
    return result.rows[0];
  }

  // Добавление тренировки к программе
  static async addWorkout(programWorkout: ProgramWorkout): Promise<ProgramWorkout> {
    const { program_id, workout_id } = programWorkout;
    
    const result = await pool.query(
      'INSERT INTO ProgramWorkouts (program_id, workout_id) VALUES ($1, $2) RETURNING *',
      [program_id, workout_id]
    );
    return result.rows[0];
  }

  // Получение тренировок программы
  static async getWorkouts(program_id: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT w.* 
       FROM ProgramWorkouts pw
       JOIN Workouts w ON pw.workout_id = w.id
       WHERE pw.program_id = $1`,
      [program_id]
    );
    return result.rows;
  }
}

export default ProgramModel;