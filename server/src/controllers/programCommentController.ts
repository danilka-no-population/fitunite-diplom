import { Request, Response } from 'express';
import ProgramCommentModel from '../models/ProgramCommentModel';

class ProgramCommentController {
  // Добавить комментарий
  static async addComment(req: Request, res: Response) {
    const { program_id, comment } = req.body;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      const newComment = await ProgramCommentModel.addComment({ user_id, program_id, comment });
      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Удалить комментарий
  static async deleteComment(req: Request, res: Response) {
    const { comment_id } = req.params;
    //@ts-ignore
    const user_id = req.user.id;

    try {
      await ProgramCommentModel.deleteComment(Number(comment_id), user_id);
      res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получить все комментарии для программы
  static async getComments(req: Request, res: Response) {
    const { program_id } = req.params;

    try {
      const comments = await ProgramCommentModel.getCommentsByProgramId(Number(program_id));
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProgramCommentController;