import express from 'express';
import FavoriteController from '../controllers/FavoriteController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
//@ts-ignore
router.use(authMiddleware);

router.post('/add', FavoriteController.addFavorite);
router.post('/remove', FavoriteController.removeFavorite);
router.get('/:program_id/is-favorite', FavoriteController.isFavorite);
router.get('/my-favorites', FavoriteController.getFavorites);

export default router;