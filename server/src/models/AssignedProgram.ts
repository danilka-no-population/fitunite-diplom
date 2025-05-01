import pool from '../config/db';

interface AssignedProgram {
  id?: number;
  program_id: number;
  client_id: number;
  trainer_id: number;
  assigned_at?: Date;
}

class AssignedProgramModel {
  // Назначение программы клиенту
  static async assignProgram(data: AssignedProgram): Promise<AssignedProgram> {
    const { program_id, client_id, trainer_id } = data;
    
    const result = await pool.query(
      `INSERT INTO AssignedPrograms (program_id, client_id, trainer_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [program_id, client_id, trainer_id]
    );
    
    return result.rows[0];
  }

  // Удаление назначенной программы
  static async unassignProgram(client_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM AssignedPrograms WHERE client_id = $1',
      [client_id]
    );
  }

  // Получение назначенной программы клиента
  static async getByClientId(client_id: number): Promise<AssignedProgram | null> {
    const result = await pool.query(
      `SELECT ap.*, p.name as program_name, p.description as program_description
       FROM AssignedPrograms ap
       JOIN Programs p ON ap.program_id = p.id
       WHERE ap.client_id = $1`,
      [client_id]
    );
    
    return result.rows[0] || null;
  }

  // Проверка, есть ли у клиента назначенная программа
  static async hasAssignedProgram(client_id: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT 1 FROM AssignedPrograms WHERE client_id = $1',
      [client_id]
    );
    //@ts-ignore
    return result.rowCount > 0;
  }

  // Получение клиентов с назначенными программами для тренера
  static async getClientsWithPrograms(trainer_id: number): Promise<any[]> {
    const result = await pool.query(
      `SELECT ap.*, u.username as client_username, u.fullname as client_fullname,
              p.name as program_name, p.id as program_id
       FROM AssignedPrograms ap
       JOIN Users u ON ap.client_id = u.id
       JOIN Programs p ON ap.program_id = p.id
       WHERE ap.trainer_id = $1`,
      [trainer_id]
    );
    
    return result.rows;
  }
}

export default AssignedProgramModel;