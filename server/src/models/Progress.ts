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
}

export default ProgressModel;