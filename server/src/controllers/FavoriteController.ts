import { Request, Response } from 'express';
import FavoriteModel from '../models/FavoriteModel';

class FavoriteController {
  // Добавить в избранное
  static async addFavorite(req: Request, res: Response) {
    const { program_id } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      await FavoriteModel.addFavorite(user_id, program_id);
      res.status(200).json({ message: 'Added to favorites' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Удалить из избранного
  static async removeFavorite(req: Request, res: Response) {
    const { program_id } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      await FavoriteModel.removeFavorite(user_id, program_id);
      res.status(200).json({ message: 'Removed from favorites' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Проверить, добавлено ли в избранное
  static async isFavorite(req: Request, res: Response) {
    const { program_id } = req.params;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const isFavorite = await FavoriteModel.isFavorite(user_id, Number(program_id));
      res.status(200).json({ isFavorite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получить избранное пользователя
  static async getFavorites(req: Request, res: Response) {
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const favorites = await FavoriteModel.getFavoritesByUserId(user_id);
      res.status(200).json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default FavoriteController;