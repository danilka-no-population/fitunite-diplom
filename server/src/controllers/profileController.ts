import { Request, Response } from 'express';
import UserModel from '../models/User';
import ProgressModel from '../models/Progress';
import multer from 'multer';
import path from 'path';

class ProfileController {
  // Получение данных пользователя
  // static async getProfile(req: Request, res: Response) {
  //   //@ts-ignore
  //   const userId = req.user.id;

  //   try {
  //     const user = await UserModel.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }

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
    const { fullname, phone_number, trainer_id = userId, specialization, avatar } = req.body;
  
    try {
      const updatedUser = await UserModel.updateProfile(userId, {
        //@ts-ignore
        fullname,
        phone_number,
        trainer_id,
        specialization,
        avatar
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  // static async updateProfile(req: Request, res: Response) {
  //   //@ts-ignore
  //   const userId = req.user.id;
  //   const { fullname, avatar, phone_number, trainer_id, specialization } = req.body;

  //   try {
  //     const updatedUser = await UserModel.update(userId, {
  //       //@ts-ignore
  //       fullname,
  //       avatar,
  //       phone_number,
  //       trainer_id,
  //       specialization,
  //     });

  //     res.status(200).json(updatedUser);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }

// Загрузка аватара
static async uploadAvatar(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;
  const avatar = req.file?.filename; // Имя загруженного файла

  if (!avatar) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const avatarUrl = `http://localhost:5000/uploads/${avatar}`; // Относительный путь к файлу
    const updatedUser = await UserModel.updateAvatar(userId, avatarUrl);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

  static async addMetrics(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const { height, weight } = req.body;

    try {
      const newMetric = await ProgressModel.addMetric({
        user_id: userId,
        date: new Date(),
        height,
        weight,
      });
      res.status(201).json(newMetric);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getMetrics(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;

    try {
      const metrics = await ProgressModel.findByUserId(userId);
      res.status(200).json(metrics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getTrainers(req: Request, res: Response) {
    try {
      const trainers = await UserModel.getTrainers();
      res.status(200).json(trainers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProfileController;