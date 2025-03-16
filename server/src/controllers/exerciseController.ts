import { Request, Response } from 'express';
import ExerciseModel from '../models/Exercise';

class ExerciseController {
  // Получение всех упражнений
  static async getExercises(req: Request, res: Response) {
    try {
      const exercises = await ExerciseModel.findAll();
      res.status(200).json(exercises);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ExerciseController;