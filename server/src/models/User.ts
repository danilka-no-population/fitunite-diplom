import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
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

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload: UserPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    }
}

export default UserModel;