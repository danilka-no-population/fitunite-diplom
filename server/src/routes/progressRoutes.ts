import express from 'express';
import ProgressController from '../controllers/progressController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', ProgressController.addMetric);
router.get('/', ProgressController.getMetrics);
router.get('/metrics', ProgressController.getUserMetrics);
router.get('/categories', ProgressController.getCategoryProgress);

export default router;