import pool from '../config/db';

export interface TrainerRequest {
  id: number;
  trainer_id: number;
  client_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: Date;
  updated_at?: Date;
}

class TrainerRequestModel {
  static async create(request: Omit<TrainerRequest, 'id' | 'created_at' | 'updated_at'>): Promise<TrainerRequest> {
    const { trainer_id, client_id } = request;
    
    const result = await pool.query(
      `INSERT INTO trainer_requests (trainer_id, client_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [trainer_id, client_id]
    );
    
    return result.rows[0];
  }

  static async findByTrainerAndClient(trainer_id: number, client_id: number): Promise<TrainerRequest | null> {
    const result = await pool.query(
      'SELECT * FROM trainer_requests WHERE trainer_id = $1 AND client_id = $2',
      [trainer_id, client_id]
    );
    return result.rows[0] || null;
  }

  static async updateStatus(id: number, status: 'accepted' | 'rejected'): Promise<TrainerRequest> {
    const result = await pool.query(
      `UPDATE trainer_requests 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM trainer_requests WHERE id = $1', [id]);
  }

  static async getPendingRequestsForClient(client_id: number): Promise<TrainerRequest[]> {
    const result = await pool.query(
      `SELECT tr.*, u.username as trainer_username, u.fullname as trainer_fullname, u.avatar as trainer_avatar
       FROM trainer_requests tr
       JOIN Users u ON tr.trainer_id = u.id
       WHERE tr.client_id = $1 AND tr.status = 'pending'`,
      [client_id]
    );
    return result.rows;
  }

  static async getRequestsForTrainer(trainer_id: number): Promise<TrainerRequest[]> {
    const result = await pool.query(
      `SELECT tr.*, u.username as client_username, u.fullname as client_fullname, u.avatar as client_avatar
       FROM trainer_requests tr
       JOIN Users u ON tr.client_id = u.id
       WHERE tr.trainer_id = $1`,
      [trainer_id]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<TrainerRequest | null> {
    const result = await pool.query(
      'SELECT * FROM trainer_requests WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}

export default TrainerRequestModel;