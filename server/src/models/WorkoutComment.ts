import pool from '../config/db';

interface WorkoutComment {
  id?: number;
  workout_id: number;
  trainer_id: number;
  comment: string;
  created_at?: Date;
}

class WorkoutCommentModel {
  static async create(comment: WorkoutComment): Promise<WorkoutComment> {
    const { workout_id, trainer_id, comment: commentText } = comment;

    const result = await pool.query(
      'INSERT INTO WorkoutComments (workout_id, trainer_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [workout_id, trainer_id, commentText]
    );

    return result.rows[0];
  }

  static async findByWorkoutId(workout_id: number): Promise<WorkoutComment[]> {
    const result = await pool.query('SELECT * FROM WorkoutComments WHERE workout_id = $1', [workout_id]);
    return result.rows;
  }
}

export default WorkoutCommentModel;