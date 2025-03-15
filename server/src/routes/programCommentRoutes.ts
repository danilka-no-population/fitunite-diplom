import express from 'express';
import ProgramCommentController from '../controllers/programCommentController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
//@ts-ignore
router.use(authMiddleware);

router.post('/comment', ProgramCommentController.addComment);
router.delete('/comment/:comment_id', ProgramCommentController.deleteComment);
router.get('/:program_id/comments', ProgramCommentController.getComments);

export default router;