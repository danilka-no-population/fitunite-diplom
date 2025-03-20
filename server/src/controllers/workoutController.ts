import { Request, Response } from 'express';
import WorkoutModel from '../models/Workout';

class WorkoutController {
  // Создание тренировки
  static async createWorkout(req: Request, res: Response) {
    const { date, duration, feeling } = req.body;
    //@ts-ignore
    const client_id = req.user.id; // Исправлено с user_id на client_id

    try {
      const newWorkout = await WorkoutModel.create({
        client_id,
        date,
        duration,
        feeling,
      });

      res.status(201).json(newWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Добавление упражнения к тренировке
  static async addExercise(req: Request, res: Response) {
    const { workout_id, exercise_id, sets, reps, weight, duration, distance } = req.body;

    try {
      const newExercise = await WorkoutModel.addExercise({
        workout_id,
        exercise_id,
        sets,
        reps,
        weight,
        duration,
        distance,
      });

      res.status(201).json(newExercise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение всех тренировок пользователя
  static async getWorkouts(req: Request, res: Response) {
    //@ts-ignore
    const client_id = req.user.id; // Исправлено с user_id на client_id

    try {
      const workouts = await WorkoutModel.findByClientId(client_id);
      res.status(200).json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение упражнений для конкретной тренировки
  static async getWorkoutExercises(req: Request, res: Response) {
    const { workout_id } = req.params;

    try {
      const exercises = await WorkoutModel.findExercisesByWorkoutId(Number(workout_id));
      res.status(200).json(exercises);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getClientWorkouts(req: Request, res: Response) {
    const { client_id } = req.params;
  
    try {
      const workouts = await WorkoutModel.findByClientId(Number(client_id));
      res.status(200).json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default WorkoutController;