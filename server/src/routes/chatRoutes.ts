import express from 'express';
import ChatController from '../controllers/chatController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
//@ts-ignore
router.use(authMiddleware);
//@ts-ignore
router.get('/', ChatController.getChats);
router.get('/:chat_id/messages', ChatController.getMessages);
//@ts-ignore
router.post('/:chat_id/messages', async (req, res, next) => {
    try {
      // Добавим проверку chat_id
      if (!req.params.chat_id || isNaN(Number(req.params.chat_id))) {
        return res.status(400).json({ message: 'Invalid chat ID' });
      }
      next();
    } catch (error) {
      next(error);
    }
    //@ts-ignore
  }, ChatController.sendMessage);
router.get('/unread-count', ChatController.getUnreadCount);
router.get('/unread-counts', ChatController.getUnreadCountsByChat);
export default router;