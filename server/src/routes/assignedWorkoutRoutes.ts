import express from 'express';
import AssignedWorkoutController from '../controllers/assignedWorkoutController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

// Назначение тренировки клиенту (тренер)
router.post(
  '/assign',
  //@ts-ignore
  authMiddleware,
  roleMiddleware('trainer'),
  AssignedWorkoutController.assignWorkout
);

// Получение назначенных тренировок клиента
router.get(
  '/client/:client_id',
  //@ts-ignore
  authMiddleware,
  AssignedWorkoutController.getClientAssignedWorkouts
);

// Отметка тренировки как выполненной (клиент)
router.put(
  '/:id/complete',
  //@ts-ignore
  authMiddleware,
  AssignedWorkoutController.markCompleted
);

// Отметка тренировки как невыполненной (клиент)
router.put(
  '/:id/uncomplete',
  //@ts-ignore
  authMiddleware,
  AssignedWorkoutController.markNotCompleted
);

// Удаление назначенной тренировки (тренер)
router.delete(
  '/:id',
  //@ts-ignore
  authMiddleware,
  roleMiddleware('trainer'),
  AssignedWorkoutController.deleteAssignedWorkout
);

export default router;