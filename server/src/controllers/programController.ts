import { Request, Response } from 'express';
import ProgramModel from '../models/Program';
import WorkoutModel from '../models/Workout';
import authMiddleware from '../middleware/authMiddleware';
import pool from '../config/db';

class ProgramController {
  // Получение всех публичных программ тренировок
  static async getPublicPrograms(req: Request, res: Response) {
    try {
      const programs = await ProgramModel.findAllPublic();
      res.status(200).json(programs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение программ текущего тренера
  static async getMyPrograms(req: Request, res: Response) {
    //@ts-ignore
    const author_id = req.user.id;

    try {
      const programs = await ProgramModel.findByAuthor(author_id);
      res.status(200).json(programs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Получение программы тренировок по ID
  static async getProgramById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const program = await ProgramModel.findById(Number(id));
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }

      // Получаем тренировки программы
      const workouts = await ProgramModel.getWorkouts(Number(id));
      program.workouts = workouts;

      res.status(200).json(program);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Создание новой программы тренировок
  static async createProgram(req: Request, res: Response) {
    //@ts-ignore
    const author_id = req.user.id;
    //@ts-ignore
    const role = req.user.role;
  
    if (role !== 'trainer') {
      return res.status(403).json({ message: 'Only trainers can create programs' });
    }
  
    const { 
      name, 
      type, 
      days_count, 
      workouts_count, 
      description, 
      is_public,
      workouts 
    } = req.body;

    // Проверка количества тренировок
    if (workouts_count < 1 || workouts_count > days_count * 2) {
      return res.status(400).json({ 
        message: `Number of workouts must be between 1 and ${days_count * 2}` 
      });
    }

    // Проверка количества добавленных тренировок
    if (workouts.length !== workouts_count) {
      return res.status(400).json({ 
        message: `You added ${workouts.length} workouts, but specified ${workouts_count}` 
      });
    }
  
    try {
      // Создаем программу
      const newProgram = await ProgramModel.create({
        name,
        type,
        days_count,
        workouts_count,
        description,
        author_id,
        is_public
      });

      // Добавляем тренировки к программе
      for (const workout of workouts) {
        let workoutId;

        if (workout.isCustom) {
          // Создаем новую тренировку без привязки к клиенту/тренеру
          const newWorkout = await WorkoutModel.create({
            name: workout.name,
            description: workout.description,
            type: workout.type,
            duration: workout.duration,
            status: 'assigned',
            date: new Date()
          });

          // Добавляем упражнения к тренировке
          for (const exercise of workout.exercises) {
            await WorkoutModel.addExercise({
              //@ts-ignore
              workout_id: newWorkout.id,
              exercise_id: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              duration: exercise.duration,
              distance: exercise.distance
            });
          }

          workoutId = newWorkout.id;
        } else {
          // Используем существующую тренировку
          workoutId = workout.id;
        }

        // Добавляем тренировку к программе
        await ProgramModel.addWorkout({
          //@ts-ignore
          program_id: newProgram.id,
          workout_id: workoutId
        });
      }

      res.status(201).json(newProgram);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getProgramWorkoutExercises(req: Request, res: Response) {
    const { workout_id } = req.params;
  
    try {
      const exercises = await pool.query(
        `SELECT we.*, e.name, e.category 
         FROM WorkoutExercises we
         JOIN Exercises e ON we.exercise_id = e.id
         WHERE we.workout_id = $1`,
        [workout_id]
      );
      res.status(200).json(exercises.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ProgramController;