import express from 'express';
import AssignedProgramController from '../controllers/assignedProgramController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

// Назначение программы клиенту (тренер)
//@ts-ignore
router.post('/assign', authMiddleware, roleMiddleware('trainer'), AssignedProgramController.assignProgram);

// Отмена назначения программы (клиент или тренер)
//@ts-ignore
router.post('/unassign', authMiddleware, AssignedProgramController.unassignProgram);

// Получение назначенной программы (клиент)
//@ts-ignore
router.get('/my-program', authMiddleware, AssignedProgramController.getAssignedProgram);

// Получение клиентов с программами (тренер)
//@ts-ignore
router.get('/clients', authMiddleware, roleMiddleware('trainer'), AssignedProgramController.getClientsWithPrograms);

export default router;