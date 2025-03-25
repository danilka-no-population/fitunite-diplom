import { Request, Response } from 'express';
import WorkoutModel from '../models/Workout';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';
import pool from '../config/db';

class WorkoutController {
  // Создание тренировки
  static async createWorkout(req: Request, res: Response) {
    const { date, feeling, duration, name, description, type, status } = req.body;
    //@ts-ignore
    const user_id = req.user.id;
    //@ts-ignore
    const role = req.user.role;

    try {
      const newWorkout = await WorkoutModel.create({
        client_id: role === 'client' ? user_id : null,
        trainer_id: role === 'trainer' ? user_id : null,
        date,
        feeling,
        duration,
        name,
        description,
        type,
        status,
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
    const user_id = req.user.id;
    //@ts-ignore
    const role = req.user.role;

    try {
      const workouts = role === 'client'
        ? await WorkoutModel.findByClientId(user_id)
        : await WorkoutModel.findByTrainerId(user_id);
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