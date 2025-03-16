import pool from '../config/db';

interface Exercise {
  id?: number;
  name: string;
  category: string;
  description: string;
  type: 'strength' | 'cardio';
}

class ExerciseModel {
  // Получение всех упражнений
  static async findAll(): Promise<Exercise[]> {
    const result = await pool.query('SELECT * FROM Exercises');
    return result.rows;
  }
}

export default ExerciseModel;