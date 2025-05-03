import { Request, Response } from 'express';
import AssignedWorkoutModel from '../models/AssignedWorkout';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

class AssignedWorkoutController {
  static async assignWorkout(req: Request, res: Response) {
    const { workout_id, client_id, target_date } = req.body;
    //@ts-ignore
    const trainer_id = req.user.id;

    try {
      const assignedWorkout = await AssignedWorkoutModel.assign({
        workout_id,
        client_id,
        trainer_id,
        target_date: new Date(target_date)
      });
      res.status(201).json(assignedWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getClientAssignedWorkouts(req: Request, res: Response) {
    const { client_id } = req.params;

    try {
      const workouts = await AssignedWorkoutModel.getByClient(Number(client_id));
      res.status(200).json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async markCompleted(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const workout = await AssignedWorkoutModel.markAsCompleted(Number(id));
      res.status(200).json(workout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async markNotCompleted(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const workout = await AssignedWorkoutModel.markAsNotCompleted(Number(id));
      res.status(200).json(workout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteAssignedWorkout(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await AssignedWorkoutModel.delete(Number(id));
      res.status(200).json({ message: 'Assigned workout deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default AssignedWorkoutController;