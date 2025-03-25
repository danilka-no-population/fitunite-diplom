import express from 'express';
import ProgramController from '../controllers/programController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

// Получение публичных программ
router.get('/public', ProgramController.getPublicPrograms);

// Получение программ текущего тренера
//@ts-ignore
router.get('/my', authMiddleware, roleMiddleware('trainer'), ProgramController.getMyPrograms);

//@ts-ignore
router.get('/:id', ProgramController.getProgramById);

// Создание новой программы
//@ts-ignore
router.post('/', authMiddleware, roleMiddleware('trainer'), ProgramController.createProgram);

export default router;