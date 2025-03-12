import pool from '../config/db';

interface Workout {
    id: number;
    client_id: number;
    date: Date;
    duration: string;
    feeling: string;
}

interface WorkoutExercise {
    id: number;
    workout_id: number;
    exercise_id: number;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: string;
    distance?: number;
}

class WorkoutModel {
    static async create(workout: Workout): Promise<Workout> {
        const { client_id, date, duration, feeling } = workout;

        const result = await pool.query(
        'INSERT INTO Workouts (client_id, date, duration, feeling) VALUES ($1, $2, $3, $4) RETURNING *',
        [client_id, date, duration, feeling]
        );

        return result.rows[0];
    }

    static async addExercise(exercise: WorkoutExercise): Promise<WorkoutExercise> {
        const { workout_id, exercise_id, sets, reps, weight, duration, distance } = exercise;

        const result = await pool.query(
        'INSERT INTO WorkoutExercises (workout_id, exercise_id, sets, reps, weight, duration, distance) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [workout_id, exercise_id, sets, reps, weight, duration, distance]
        );

        return result.rows[0];
    }

    static async findByClientId(client_id: number): Promise<Workout[]> {
        const result = await pool.query('SELECT * FROM Workouts WHERE client_id = $1', [client_id]);
        return result.rows;
    }

    static async findExercisesByWorkoutId(workout_id: number): Promise<WorkoutExercise[]> {
        const result = await pool.query('SELECT * FROM WorkoutExercises WHERE workout_id = $1', [workout_id]);
        return result.rows;
    }
}

export default WorkoutModel;