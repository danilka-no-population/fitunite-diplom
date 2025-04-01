import { Request, Response } from 'express';
import ChatModel from '../models/Chat';
import authMiddleware from '../middleware/authMiddleware';
import pool from '../config/db';

class ChatController {
  static async getChats(req: Request, res: Response) {
    try {
      //@ts-ignore
      const user_id = req.user.id;
      //@ts-ignore
      const role = req.user.role;

      if (role === 'trainer') {
        const chats = await ChatModel.findByTrainerId(user_id);
        return res.status(200).json(chats);
      } else {
        const chat = await ChatModel.findByClientId(user_id);
        return res.status(200).json(chat ? [chat] : []);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getMessages(req: Request, res: Response) {
    try {
      const { chat_id } = req.params;
      //@ts-ignore
      const user_id = req.user.id;

      const messages = await ChatModel.getMessages(Number(chat_id));
      await ChatModel.markAsRead(Number(chat_id), user_id);

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { chat_id } = req.params;
      const { message } = req.body;
      //@ts-ignore
      const sender_id = req.user.id;
  
      // Проверка существования чата
      const chatExists = await pool.query(
        'SELECT 1 FROM Chats WHERE id = $1 AND (trainer_id = $2 OR client_id = $2)',
        [chat_id, sender_id]
      );
  
      if (!chatExists.rows.length) {
        return res.status(403).json({ message: 'You are not part of this chat' });
      }
  
      const newMessage = await ChatModel.createMessage({
        chat_id: Number(chat_id),
        sender_id,
        message
      });
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      //@ts-ignore
      const user_id = req.user.id;
      //@ts-ignore
      const role = req.user.role;
  
      const count = role === 'client' 
        ? await ChatModel.getClientUnreadCount(user_id)
        : await ChatModel.getUnreadCount(user_id);
        
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getUnreadCountsByChat(req: Request, res: Response) {
    try {
      //@ts-ignore
      const user_id = req.user.id;
  
      const counts = await ChatModel.getUnreadCountsByChat(user_id);
      res.status(200).json(counts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default ChatController;