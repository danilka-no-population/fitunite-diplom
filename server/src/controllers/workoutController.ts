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
        status: 'assigned',
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



  // Добавим новые методы в класс WorkoutController
  static async assignWorkout(req: Request, res: Response) {
    const { client_id, date, name, description, type } = req.body;
    //@ts-ignore
    const trainer_id = req.user.id;

    try {
      const newWorkout = await WorkoutModel.create({
        client_id,
        trainer_id,
        date,
        name,
        description,
        type,
        status: 'pending' // Статус "ожидает выполнения"
      });

      res.status(201).json(newWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // server/src/controllers/workoutController.ts
  // static async updateWorkoutStatus(req: Request, res: Response) {
  //   const { workout_id } = req.params;
  //   const { status, feeling } = req.body;
  //   //@ts-ignore
  //   const user_id = req.user.id;

  //   try {
  //     const workout = await WorkoutModel.findById(Number(workout_id));
  //     if (!workout) {
  //       return res.status(404).json({ message: 'Workout not found' });
  //     }
  
  //     const updatedWorkout = await WorkoutModel.updateStatus(
  //       Number(workout_id), 
  //       status,
  //       feeling
  //     );
      
  //     res.status(200).json(updatedWorkout);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // }
  static async updateWorkoutStatus(req: Request, res: Response) {
    const { workout_id } = req.params;
    const { status, feeling } = req.body;
    
    try {
      const workout = await WorkoutModel.findById(Number(workout_id));
      if (!workout) {
        return res.status(404).json({ message: 'Тренировка не найдена' });
      }
  
      // Проверяем, что статус допустимый
      if (!['completed', 'skipped'].includes(status)) {
        return res.status(400).json({ message: 'Недопустимый статус тренировки' });
      }
  
      const updatedWorkout = await WorkoutModel.updateStatus(
        Number(workout_id), 
        status,
        feeling
      );
  
      // Возвращаем обновленные данные тренировки
      const exercises = await WorkoutModel.findExercisesByWorkoutId(Number(workout_id));
      res.status(200).json({ ...updatedWorkout, exercises });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  // static async updateWorkoutStatus(req: Request, res: Response) {
  //   const { workout_id } = req.params;
  //   const { status, feeling } = req.body;
    
  //   try {
  //     const workout = await WorkoutModel.findById(Number(workout_id));
  //     if (!workout) return res.status(404).json({ message: 'Тренировка не найдена' });
  
  //     const updatedWorkout = await WorkoutModel.updateStatus(
  //       Number(workout_id), 
  //       status,
  //       feeling
  //     );
      
  //     // Возвращаем полные данные тренировки с упражнениями
  //     const exercises = await WorkoutModel.findExercisesByWorkoutId(Number(workout_id));
  //     res.status(200).json({ ...updatedWorkout, exercises });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Ошибка сервера' });
  //   }
  // }

  static async getAssignedWorkouts(req: Request, res: Response) {
    //@ts-ignore
    const client_id = req.user.id;

    try {
      const workouts = await WorkoutModel.getAssignedWorkouts(client_id);
      res.status(200).json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default WorkoutController;