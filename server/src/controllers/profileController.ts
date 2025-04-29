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

  // // Обновление данных пользователя
  // static async updateProfile(req: Request, res: Response) {
  //   //@ts-ignore
  //   const userId = req.user.id;
  //   const { fullname, phone_number, trainer_id = userId, specialization, avatar } = req.body;
  
  //   try {
  //     const updatedUser = await UserModel.updateProfile(userId, {
  //       //@ts-ignore
  //       fullname,
  //       phone_number,
  //       trainer_id,
  //       specialization,
  //       avatar
  //     });
  //     res.status(200).json(updatedUser);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }

  static async updateProfile(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const { fullname, phone_number, trainer_id = userId, specialization, avatar, height } = req.body;
  
    try {
      const updatedUser = await UserModel.updateProfile(userId, {
        //@ts-ignore
        fullname,
        phone_number,
        trainer_id,
        specialization,
        avatar,
        height: height ? parseInt(height) : null
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
}

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

  static async getMyClients(req: Request, res: Response) {
    //@ts-ignore
    const trainerId = req.user.id;

    try {
      const clients = await UserModel.getClientsByTrainerId(trainerId);
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // static async searchClients(req: Request, res: Response) {
  //   const { query } = req.query;
  //   //@ts-ignore
  //   const trainerId = req.user.id;

  //   try {
  //     const clients = await UserModel.searchClients(query as string, trainerId);
  //     res.status(200).json(clients);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }

  static async searchClients(req: Request, res: Response) {
    const { query } = req.query;
  
    try {
      const clients = await UserModel.searchClients(query as string);
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async addClient(req: Request, res: Response) {
    const { clientId } = req.body;
    //@ts-ignore
    const trainerId = req.user.id;

    try {
      await UserModel.addClient(trainerId, clientId);
      res.status(200).json({ message: 'Client added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getAllClients(req: Request, res: Response) {
    try {
      const clients = await UserModel.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async removeClient(req: Request, res: Response) {
    const { clientId } = req.body;
    //@ts-ignore
    const trainerId = req.user.id;

    try {
      await UserModel.removeClient(trainerId, clientId);
      res.status(200).json({ message: 'Client removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getClientProfile(req: Request, res: Response) {
    const { id } = req.params;
    //@ts-ignore
    const trainerId = req.user.id;
  
    try {
      const client = await UserModel.findById(Number(id));
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      // Проверяем, является ли клиент клиентом текущего тренера
      //@ts-ignore
      const isClient = client.trainer_id === trainerId;
  
      res.status(200).json({ ...client, isClient });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProfileController;