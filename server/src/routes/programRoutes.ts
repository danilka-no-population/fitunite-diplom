import express from 'express';
import ProgramController from '../controllers/programController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Получение всех программ тренировок
router.get('/', ProgramController.getPrograms);

//@ts-ignore
router.get('/:id', ProgramController.getProgramById);

//@ts-ignore
router.post('/', authMiddleware, ProgramController.createProgram);

export default router;