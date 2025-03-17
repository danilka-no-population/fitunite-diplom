import express from 'express';
import ProgressController from '../controllers/progressController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', ProgressController.addMetric);
router.get('/', ProgressController.getMetrics);
router.get('/metrics', ProgressController.getUserMetrics);
router.get('/categories', ProgressController.getCategoryProgress);

// Новый маршрут для получения прогресса клиента тренером
//@ts-ignore
router.get('/client/:user_id', roleMiddleware('trainer'), ProgressController.getClientProgress);
router.get('/my-progress', ProgressController.getMyProgress);
export default router;