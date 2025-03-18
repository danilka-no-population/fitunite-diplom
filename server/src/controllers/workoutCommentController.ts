import { Request, Response } from 'express';
import WorkoutCommentModel from '../models/WorkoutComment';

class WorkoutCommentController {
  static async createComment(req: Request, res: Response) {
    const { workout_id, comment } = req.body;
    //@ts-ignore
    const trainer_id = req.user.id;

    try {
      const newComment = await WorkoutCommentModel.create({
        workout_id,
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
    const { workout_id } = req.params;

    try {
      const comments = await WorkoutCommentModel.findByWorkoutId(Number(workout_id));
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default WorkoutCommentController;