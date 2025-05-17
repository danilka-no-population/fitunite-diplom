import pool from '../config/db';

interface Workout {
  id?: number;
  client_id?: number;
  trainer_id?: number;
  date: Date;
  feeling?: string;
  duration?: number;
  name?: string;
  description?: string;
  type?: string;
  status?: string;
}

interface WorkoutExercise {
  id?: number;
  workout_id: number;
  exercise_id: number;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: string;
  distance?: number;
}

class WorkoutModel {
  // Создание тренировки
  static async create(workout: Workout): Promise<Workout> {
    const { client_id, trainer_id, date, feeling, duration, name, description, type, status } = workout;

    const result = await pool.query(
      'INSERT INTO Workouts (client_id, trainer_id, date, feeling, duration, name, description, type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [client_id, trainer_id, date, feeling, duration, name, description, type, status]
    );

    return result.rows[0];
  }

  // Добавление упражнения к тренировке
  static async addExercise(exercise: WorkoutExercise): Promise<WorkoutExercise> {
    const { workout_id, exercise_id, sets, reps, weight, duration, distance } = exercise;

    const result = await pool.query(
      'INSERT INTO WorkoutExercises (workout_id, exercise_id, sets, reps, weight, duration, distance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [workout_id, exercise_id, sets, reps, weight, duration, distance]
    );

    return result.rows[0];
  }

  // Получение всех тренировок пользователя
  static async findByClientId(client_id: number): Promise<Workout[]> {
    const result = await pool.query('SELECT * FROM Workouts WHERE client_id = $1', [client_id]);
    return result.rows;
  }

  // Получение всех тренировок тренера
  static async findByTrainerId(trainer_id: number): Promise<Workout[]> {
    const result = await pool.query('SELECT * FROM Workouts WHERE trainer_id = $1', [trainer_id]);
    return result.rows;
  }

  // Получение упражнений для конкретной тренировки
  static async findExercisesByWorkoutId(workout_id: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT we.*, e.name, e.category, e.type 
       FROM WorkoutExercises we
       JOIN Exercises e ON we.exercise_id = e.id
       WHERE we.workout_id = $1`,
      [workout_id]
    );
    return result.rows;
  }



  // Добавим новые методы в класс WorkoutModel
  static async assignWorkout(workout: Workout): Promise<Workout> {
    const { client_id, trainer_id, date, name, description, type, status } = workout;

    const result = await pool.query(
      'INSERT INTO Workouts (client_id, trainer_id, date, name, description, type, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [client_id, trainer_id, date, name, description, type, status]
    );

    return result.rows[0];
  }

  static async updateStatus(workout_id: number, status: string, feeling?: string): Promise<Workout> {
    const result = await pool.query(
      'UPDATE Workouts SET status = $1, feeling = $2 WHERE id = $3 RETURNING *',
      [status, feeling, workout_id]
    );
    return result.rows[0];
  }

  // static async updateStatus(workout_id: number, status: string, feeling?: string): Promise<Workout> {
  //   const result = await pool.query(
  //     `UPDATE Workouts 
  //      SET status = $1, feeling = $2, date = CASE WHEN $1 = 'completed' THEN NOW() ELSE NULL END
  //      WHERE id = $3 
  //      RETURNING *`,
  //     [status, feeling, workout_id]
  //   );
  //   return result.rows[0];
  // }

  static async getAssignedWorkouts(client_id: number): Promise<Workout[]> {
    const result = await pool.query(
      'SELECT * FROM Workouts WHERE client_id = $1 AND trainer_id IS NOT NULL AND status = $2 ORDER BY date DESC',
      [client_id, 'pending']
    );
    return result.rows;
  }

  // Добавим новый метод в класс WorkoutModel
  static async findById(id: number): Promise<Workout | null> {
    const result = await pool.query('SELECT * FROM Workouts WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}

export default WorkoutModel;