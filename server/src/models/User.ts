import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ChatModel from './Chat';
import { notifyChatCreated, notifyChatDeleted } from '../websocket';

export interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'client' | 'trainer';
    created_at?: Date;
}

interface UserPayload {
    id: number;
    username: string;
    role: string;
}

class UserModel {
    static async create(user: User): Promise<User> {
        const { username, email, password_hash, role } = user;
        const hashedPassword = await bcrypt.hash(password_hash, 10);

        const result = await pool.query(
        'INSERT INTO Users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, hashedPassword, role]
        );

        return result.rows[0];
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }

    static async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM Users WHERE email = $1 OR username = $1',
            [emailOrUsername]
        );
        return result.rows[0] || null;
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload: UserPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }

    static async findById(id: number): Promise<User | null> {
        const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }


    // static async update(id: number, data: Partial<User>): Promise<User> {
    //     //@ts-ignore
    //     const { fullname, avatar, phone_number, trainer_id, specialization } = data;
        
    //     const result = await pool.query(
    //         'UPDATE Users SET fullname = $1, avatar = $2, phone_number = $3, trainer_id = $4, specialization = $5 WHERE id = $6 RETURNING *',
    //         [fullname, avatar, phone_number, trainer_id, specialization, id]
    //     );
        
    //     return result.rows[0];
    // }

    static async update(id: number, data: Partial<User>): Promise<User> {
      //@ts-ignore
      const { fullname, avatar, phone_number, trainer_id, specialization, height } = data;
      
      const result = await pool.query(
          'UPDATE Users SET fullname = $1, avatar = $2, phone_number = $3, trainer_id = $4, specialization = $5, height = $6 WHERE id = $7 RETURNING *',
          [fullname, avatar, phone_number, trainer_id, specialization, height, id]
      );
      
      return result.rows[0];
    }

    // static async updateProfile(id: number, data: Partial<User>): Promise<User> {
    //     //@ts-ignore
    //     const { fullname, avatar, phone_number, trainer_id, specialization } = data;
      
    //     const result = await pool.query(
    //       `UPDATE Users 
    //        SET fullname = $1, avatar = $2, phone_number = $3, trainer_id = $4, specialization = $5 
    //        WHERE id = $6 
    //        RETURNING *`,
    //       [fullname, avatar, phone_number, trainer_id || id, specialization, id]
    //     );
      
    //     return result.rows[0];
    //   }

    static async updateProfile(id: number, data: Partial<User>): Promise<User> {
      //@ts-ignore
      const { fullname, avatar, phone_number, trainer_id, specialization, height } = data;
    
      const result = await pool.query(
        `UPDATE Users 
         SET fullname = $1, avatar = $2, phone_number = $3, trainer_id = $4, specialization = $5, height = $6
         WHERE id = $7 
         RETURNING *`,
        [fullname, avatar, phone_number, trainer_id || id, specialization, height, id]
      );
    
      return result.rows[0];
    }
      
      static async updateAvatar(id: number, avatar: string): Promise<User> {
        const result = await pool.query(
          'UPDATE Users SET avatar = $1 WHERE id = $2 RETURNING *',
          [avatar, id]
        );
        return result.rows[0];
      }

      static async getTrainers(): Promise<User[]> {
        const result = await pool.query('SELECT * FROM Users WHERE role = $1', ['trainer']);
        return result.rows;
      }


    //   static async getClientsByTrainerId(trainerId: number): Promise<User[]> {
    //     const result = await pool.query(
    //       'SELECT * FROM Users WHERE trainer_id = $1',
    //       [trainerId]
    //     );
    //     return result.rows;
    //   }

    static async getClientsByTrainerId(trainerId: number): Promise<User[]> {
        const result = await pool.query(
          `SELECT * FROM Users 
           WHERE trainer_id = $1 
             AND id != $1`,
          [trainerId]
        );
        return result.rows;
      }
    
    //   static async searchClients(query: string, trainerId: number): Promise<User[]> {
    //     const result = await pool.query(
    //       `SELECT * FROM Users 
    //        WHERE (username ILIKE $1 OR fullname ILIKE $1) 
    //        AND role = 'client' 
    //        AND (trainer_id = $2 OR trainer_id IS NULL)`,
    //       [`%${query}%`, trainerId]
    //     );
    //     return result.rows;
    //   }

    static async searchClients(query: string): Promise<User[]> {
        const result = await pool.query(
          `SELECT * FROM Users 
           WHERE (username ILIKE $1 OR fullname ILIKE $1) 
           AND role = 'client'`,
          [`%${query}%`]
        );
        return result.rows;
      }

      // static async addClient(trainerId: number, clientId: number): Promise<void> {
      //   await pool.query(
      //     'UPDATE Users SET trainer_id = $1 WHERE id = $2',
      //     [trainerId, clientId]
      //   );
      // }

      static async getAllClients(): Promise<User[]> {
        const result = await pool.query(
          "SELECT * FROM Users WHERE role = 'client'"
        );
        return result.rows;
      }
    
      // static async removeClient(trainerId: number, clientId: number): Promise<void> {
      //   await pool.query(
      //     'UPDATE Users SET trainer_id = NULL WHERE id = $1 AND trainer_id = $2',
      //     [clientId, trainerId]
      //   );
      // }

      static async addClient(trainerId: number, clientId: number): Promise<void> {
        await pool.query(
          'UPDATE Users SET trainer_id = $1 WHERE id = $2',
          [trainerId, clientId]
        );
        
        // Создаем чат
        await ChatModel.findOrCreate(trainerId, clientId);
        notifyChatCreated(trainerId, clientId);
      }
      
      static async removeClient(trainerId: number, clientId: number): Promise<void> {
        await pool.query(
          'UPDATE Users SET trainer_id = NULL WHERE id = $1 AND trainer_id = $2',
          [clientId, trainerId]
        );
        
        // Удаляем чат
        await ChatModel.delete(trainerId, clientId);
        notifyChatDeleted(trainerId, clientId);
      }
}

export default UserModel;