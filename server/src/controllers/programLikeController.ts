import { Request, Response } from 'express';
import ProgramLikeModel from '../models/ProgramLikeModel';

class ProgramLikeController {
  // Поставить лайк
  static async likeProgram(req: Request, res: Response) {
    const { program_id } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      await ProgramLikeModel.likeProgram(user_id, program_id);
      const likesCount = await ProgramLikeModel.getLikesCount(program_id);
      res.status(200).json({ likesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Убрать лайк
  static async unlikeProgram(req: Request, res: Response) {
    const { program_id } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      await ProgramLikeModel.unlikeProgram(user_id, program_id);
      const likesCount = await ProgramLikeModel.getLikesCount(program_id);
      res.status(200).json({ likesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Проверить, поставил ли пользователь лайк
  static async isLiked(req: Request, res: Response) {
    const { program_id } = req.params;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const isLiked = await ProgramLikeModel.isLiked(user_id, Number(program_id));
      res.status(200).json({ isLiked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getLikesCount(req: Request, res: Response) {
    const { program_id } = req.params;
  
    try {
      const likesCount = await ProgramLikeModel.getLikesCount(Number(program_id));
      res.status(200).json({ likesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProgramLikeController;