import express from 'express';
import ProfileController from '../controllers/profileController';
import authMiddleware from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads')); // Папка для загрузки файлов
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Сохраняем с оригинальным расширением
    },
  });

const upload = multer({ storage });

//@ts-ignore
router.use(authMiddleware);

//@ts-ignore
router.get('/', ProfileController.getProfile);

// Обновление данных пользователя
router.put('/', ProfileController.updateProfile);
//@ts-ignore
router.post('/avatar', upload.single('avatar'), ProfileController.uploadAvatar);
router.post('/metrics', ProfileController.addMetrics);
router.get('/metrics', ProfileController.getMetrics);
router.get('/trainers', ProfileController.getTrainers);
//@ts-ignore
router.get('/my-clients', authMiddleware, ProfileController.getMyClients);
//@ts-ignore
router.get('/search-clients', authMiddleware, ProfileController.searchClients);
//@ts-ignore
router.post('/add-client', authMiddleware, ProfileController.addClient);
//@ts-ignore
router.get('/all-clients', authMiddleware, ProfileController.getAllClients);
//@ts-ignore
router.post('/remove-client', authMiddleware, ProfileController.removeClient);
//@ts-ignore
router.get('/:id', authMiddleware, ProfileController.getClientProfile);

export default router;