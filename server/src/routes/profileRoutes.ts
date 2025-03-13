import express from 'express';
import ProfileController from '../controllers/profileController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.use(authMiddleware);

//@ts-ignore
router.get('/', ProfileController.getProfile);

// Обновление данных пользователя
router.put('/', ProfileController.updateProfile);

export default router;