import { Request, Response } from 'express';
import UserModel from '../models/User';

class AuthController {
    static async register(req: Request, res: Response) {
        const { username, email, password, role } = req.body;
        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
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
        const { email, password } = req.body;

        try {
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await UserModel.comparePassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
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