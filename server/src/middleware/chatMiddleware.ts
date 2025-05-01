// server/src/middleware/chatMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import ChatModel from '../models/Chat';
import { notifyChatDeleted } from '../websocket';

export const checkTrainerClientRelationship = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    const user_id = req.user.id;
    //@ts-ignore
    const role = req.user.role;

    if (role === 'client') {
      // Для клиента проверяем, есть ли у него тренер
      const result = await pool.query(
        'SELECT trainer_id FROM users WHERE id = $1',
        [user_id]
      );
      
      if (!result.rows[0].trainer_id) {
        // У клиента нет тренера - удаляем чат, если он существует
        const chat = await ChatModel.findByClientId(user_id);
        if (chat) {
          await ChatModel.delete(chat.trainer_id, chat.client_id);
          notifyChatDeleted(chat.trainer_id, chat.client_id);
        }
        return res.status(200).json([]);
      }
    } else if (role === 'trainer') {
      // Для тренера проверяем, есть ли у него клиенты
      const result = await pool.query(
        'SELECT 1 FROM users WHERE trainer_id = $1 LIMIT 1',
        [user_id]
      );
      
      if (!result.rows.length) {
        // У тренера нет клиентов - удаляем все его чаты
        const chats = await ChatModel.findByTrainerId(user_id);
        for (const chat of chats) {
          await ChatModel.delete(chat.trainer_id, chat.client_id);
          notifyChatDeleted(chat.trainer_id, chat.client_id);
        }
        return res.status(200).json([]);
      }
    }

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};