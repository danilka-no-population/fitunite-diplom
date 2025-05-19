import express from 'express';
import TrainerRequestController from '../controllers/trainerRequestController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// @ts-ignore
router.use(authMiddleware);
// @ts-ignore
router.post('/send', TrainerRequestController.sendRequest);
// @ts-ignore
router.get('/pending', TrainerRequestController.getPendingRequests);
// @ts-ignore
router.get('/trainer', TrainerRequestController.getTrainerRequests);
// @ts-ignore
router.post('/:requestId/accept', TrainerRequestController.acceptRequest);
// @ts-ignore
router.post('/:requestId/reject', TrainerRequestController.rejectRequest);
// @ts-ignore
router.delete('/:requestId', TrainerRequestController.cancelRequest);

export default router;