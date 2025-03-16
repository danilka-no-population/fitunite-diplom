import express from 'express';
import AuthController from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

//@ts-ignore
router.post('/register', AuthController.register);
//@ts-ignore
router.post('/login', AuthController.login);
//@ts-ignore
router.get('/me', authMiddleware, (req, res) => {
    //@ts-ignore
    res.json(req.user);
});

export default router;