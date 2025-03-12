import { Request, Response } from 'express';
import WorkoutModel from '../models/Workout';

class WorkoutController {
    static async createWorkout(req: Request, res: Response) {
        const { date, duration, feeling } = req.body;
        //@ts-ignore
        const client_id = req.user.id;

        try {
            //@ts-ignore
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

    static async addExercise(req: Request, res: Response) {
        const { workout_id, exercise_id, sets, reps, weight, duration, distance } = req.body;

        try {
            //@ts-ignore
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

    static async getWorkouts(req: Request, res: Response) {
        //@ts-ignore
        const client_id = req.user.id;

        try {
            const workouts = await WorkoutModel.findByClientId(client_id);
            res.status(200).json(workouts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getExercises(req: Request, res: Response) {
        const { workout_id } = req.params;

        try {
            const exercises = await WorkoutModel.findExercisesByWorkoutId(Number(workout_id));
            res.status(200).json(exercises);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export default WorkoutController;