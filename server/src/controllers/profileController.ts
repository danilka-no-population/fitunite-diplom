import { Request, Response } from 'express';
import UserModel from '../models/User';

class ProfileController {
  // Получение данных пользователя
  static async getProfile(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Обновление данных пользователя
  static async updateProfile(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const { fullname, avatar, phone_number, trainer_id, specialization } = req.body;

    try {
      const updatedUser = await UserModel.update(userId, {
        //@ts-ignore
        fullname,
        avatar,
        phone_number,
        trainer_id,
        specialization,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProfileController;