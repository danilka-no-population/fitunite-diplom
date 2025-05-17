import pool from '../config/db';

interface UserMetric {
    id?: number;
    user_id: number;
    date: Date;
    weight: number;
    height: number;
}

class ProgressModel {
    static async addMetric(metric: UserMetric): Promise<UserMetric> {
        const { user_id, date, weight, height } = metric;

        const result = await pool.query(
        'INSERT INTO UserMetrics (user_id, date, weight, height) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, date, weight, height]
        );

        return result.rows[0];
    }

    static async findByUserId(user_id: number): Promise<UserMetric[]> {
        const result = await pool.query('SELECT * FROM UserMetrics WHERE user_id = $1', [user_id]);
        return result.rows;
    }

        // Получаем все тренировки пользователя
        // static async getUserWorkouts(user_id: number) {
        //     const result = await pool.query(
        //         'SELECT * FROM Workouts WHERE client_id = $1 ORDER BY date ASC',
        //         [user_id]
        //     );
        //     return result.rows;
        // }
        static async getUserWorkouts(user_id: number) {
            const result = await pool.query(
                `SELECT * FROM Workouts WHERE client_id = $1 AND (status = \'assigned\' OR status = \'completed\') ORDER BY date ASC`,
                [user_id]
            );
            return result.rows;
        }
    
        // Получаем все упражнения пользователя с привязкой к категориям
        // static async getUserWorkoutExercises(user_id: number) {
        //     const result = await pool.query(
        //         `SELECT we.*, w.date, e.category, e.type, e.id as exercise_id, e.name as exercise_name
        //          FROM WorkoutExercises we
        //          JOIN Workouts w ON we.workout_id = w.id
        //          JOIN Exercises e ON we.exercise_id = e.id
        //          WHERE w.client_id = $1
        //          ORDER BY w.date ASC`,
        //         [user_id]
        //     );
        //     return result.rows;
        // }
        static async getUserWorkoutExercises(user_id: number) {
            const result = await pool.query(
                `SELECT we.*, w.date, e.category, e.type, e.id as exercise_id, e.name as exercise_name
                 FROM WorkoutExercises we
                 JOIN Workouts w ON we.workout_id = w.id
                 JOIN Exercises e ON we.exercise_id = e.id
                 WHERE w.client_id = $1 
                 AND (w.status = 'assigned' OR w.status = 'completed')
                 ORDER BY w.date ASC`,
                [user_id]
            );
            return result.rows;
        }

        static async getUserMetrics(user_id: number) {
            const result = await pool.query(
                'SELECT * FROM UserMetrics WHERE user_id = $1 ORDER BY date ASC',
                [user_id]
            );
            return result.rows;
        }

            // Получение прогресса клиента (метрики + упражнения)
    static async getClientProgress(user_id: number) {
        const metrics = await this.getUserMetrics(user_id);
        const exercises = await this.getUserWorkoutExercises(user_id);

        return { metrics, exercises };
    }
}

export default ProgressModel;