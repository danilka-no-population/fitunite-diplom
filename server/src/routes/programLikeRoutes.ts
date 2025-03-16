import express from 'express';
import ProgramLikeController from '../controllers/programLikeController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);

router.post('/like', ProgramLikeController.likeProgram);
router.post('/unlike', ProgramLikeController.unlikeProgram);
router.get('/:program_id/is-liked', ProgramLikeController.isLiked);
router.get('/:program_id/count', ProgramLikeController.getLikesCount);

export default router;