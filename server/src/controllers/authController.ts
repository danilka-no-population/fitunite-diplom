import { Request, Response } from 'express';
import UserModel from '../models/User';
import pool from '../config/db';

class AuthController {
    static async register(req: Request, res: Response) {
        const { username, email, password, role } = req.body;
    
        try {
            const existingUserByEmail = await UserModel.findByEmail(email);
            const existingUserByUsername = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        
            if (existingUserByEmail) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
            if (existingUserByUsername.rows[0]) {
                return res.status(400).json({ message: 'User with this username already exists' });
            }
        
            const newUser = await UserModel.create({
                username,
                email,
                password_hash: password,
                role,
            });
        
            const token = UserModel.generateToken({
                id: newUser.id!,
                username: newUser.username,
                role: newUser.role,
            });
        
            res.status(201).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async login(req: Request, res: Response) {
        const { emailOrUsername, password } = req.body;
    
        try {
            const user = await UserModel.findByEmailOrUsername(emailOrUsername);
            if (!user) {
                return res.status(400).json({ message: 'Invalid email/username or password' });
            }
    
            const isMatch = await UserModel.comparePassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email/username or password' });
            }
    
            const token = UserModel.generateToken({
                id: user.id!,
                username: user.username,
                role: user.role,
            });
        
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export default AuthController;