// server/src/routes/chatRoutes.ts
import express from 'express';
import ChatController from '../controllers/chatController';
import authMiddleware from '../middleware/authMiddleware';
import { checkTrainerClientRelationship } from '../middleware/chatMiddleware';

const router = express.Router();
//@ts-ignore
router.use(authMiddleware);
//@ts-ignore
router.get('/', checkTrainerClientRelationship, ChatController.getChats);
router.get('/:chat_id/messages', ChatController.getMessages);
//@ts-ignore
router.post('/:chat_id/messages', async (req, res, next) => {
    try {
      if (!req.params.chat_id || isNaN(Number(req.params.chat_id))) {
        return res.status(400).json({ message: 'Invalid chat ID' });
      }
      next();
    } catch (error) {
      next(error);
    }
    //@ts-ignore
  }, ChatController.sendMessage);
  //@ts-ignore
router.get('/unread-count', checkTrainerClientRelationship, ChatController.getUnreadCount);
//@ts-ignore
router.get('/unread-counts', checkTrainerClientRelationship, ChatController.getUnreadCountsByChat);
export default router;