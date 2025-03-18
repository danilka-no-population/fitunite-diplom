import { Request, Response } from 'express';
import MealCommentModel from '../models/MealComment';

class MealCommentController {
  static async createComment(req: Request, res: Response) {
    const { meal_id, comment } = req.body;
    //@ts-ignore
    const trainer_id = req.user.id;

    try {
      const newComment = await MealCommentModel.create({
        meal_id,
        trainer_id,
        comment,
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getComments(req: Request, res: Response) {
    const { meal_id } = req.params;

    try {
      const comments = await MealCommentModel.findByMealId(Number(meal_id));
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default MealCommentController;