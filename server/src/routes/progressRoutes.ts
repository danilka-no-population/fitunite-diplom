import express from 'express';
import ProgressController from '../controllers/progressController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);
router.post('/', ProgressController.addMetric);
router.get('/', ProgressController.getMetrics);

export default router;