import pool from '../config/db';

interface Workout {
  id?: number;
  client_id: number; // Исправлено с user_id на client_id
  date: Date;
  duration: string;
  feeling: string;
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
    const { client_id, date, duration, feeling } = workout;

    const result = await pool.query(
      'INSERT INTO Workouts (client_id, date, duration, feeling) VALUES ($1, $2, $3, $4) RETURNING *',
      [client_id, date, duration, feeling]
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
}

export default WorkoutModel;