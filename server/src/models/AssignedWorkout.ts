import pool from '../config/db';

interface AssignedWorkout {
  id?: number;
  workout_id: number;
  client_id: number;
  trainer_id: number;
  assigned_date?: Date;
  target_date: Date;
  completed?: boolean;
  completed_date?: Date;
}

class AssignedWorkoutModel {
  static async assign(workout: AssignedWorkout): Promise<AssignedWorkout> {
    const { workout_id, client_id, trainer_id, target_date } = workout;
    
    const result = await pool.query(
      `INSERT INTO AssignedWorkouts 
       (workout_id, client_id, trainer_id, target_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [workout_id, client_id, trainer_id, target_date]
    );
    
    // Обновляем флаг is_assigned в таблице Workouts
    await pool.query(
      'UPDATE Workouts SET is_assigned = true WHERE id = $1',
      [workout_id]
    );
    
    return result.rows[0];
  }

  static async getByClient(client_id: number): Promise<AssignedWorkout[]> {
    const result = await pool.query(
      `SELECT aw.*, w.name, w.description, w.type, w.duration
       FROM AssignedWorkouts aw
       JOIN Workouts w ON aw.workout_id = w.id
       WHERE aw.client_id = $1
       ORDER BY aw.target_date DESC`,
      [client_id]
    );
    return result.rows;
  }

  static async markAsCompleted(id: number): Promise<AssignedWorkout> {
    const result = await pool.query(
      `UPDATE AssignedWorkouts 
       SET completed = true, completed_date = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async markAsNotCompleted(id: number): Promise<AssignedWorkout> {
    const result = await pool.query(
      `UPDATE AssignedWorkouts 
       SET completed = false, completed_date = NULL 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    // Получаем workout_id перед удалением
    const workout = await pool.query(
      'SELECT workout_id FROM AssignedWorkouts WHERE id = $1',
      [id]
    );
    
    if (workout.rows.length > 0) {
      const workout_id = workout.rows[0].workout_id;
      
      // Удаляем назначенную тренировку
      await pool.query(
        'DELETE FROM AssignedWorkouts WHERE id = $1',
        [id]
      );
      
      // Проверяем, есть ли еще назначения для этой тренировки
      const remainingAssignments = await pool.query(
        'SELECT 1 FROM AssignedWorkouts WHERE workout_id = $1',
        [workout_id]
      );
      
      // Если назначений больше нет, сбрасываем флаг is_assigned
      if (remainingAssignments.rowCount === 0) {
        await pool.query(
          'UPDATE Workouts SET is_assigned = false WHERE id = $1',
          [workout_id]
        );
      }
    }
  }
}

export default AssignedWorkoutModel;