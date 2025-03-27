import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import pool from './config/db';
import ChatModel from './models/Chat';

interface UserConnection {
  userId: number;
  ws: any;
}

const connections: UserConnection[] = [];

export const setupWSServer = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const token = req.url?.split('token=')[1];
    
    if (!token) {
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; username: string; role: string };
      connections.push({ userId: decoded.id, ws });

      ws.on('close', () => {
        const index = connections.findIndex(c => c.userId === decoded.id);
        if (index !== -1) {
          connections.splice(index, 1);
        }
      });

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'message') {
            const { chat_id, sender_id, message: text } = data;
            
            // Проверяем существование чата
            const chatCheck = await pool.query(
              'SELECT trainer_id, client_id FROM Chats WHERE id = $1',
              [chat_id]
            );
            
            if (!chatCheck.rows.length) {
              console.error(`Chat with id ${chat_id} not found`);
              return;
            }
      
            // Сохраняем сообщение в БД
            const newMessage = await ChatModel.createMessage({
              chat_id,
              sender_id,
              message: text
            });
      
            const chat = chatCheck.rows[0];
            const receiverId = chat.trainer_id === sender_id ? chat.client_id : chat.trainer_id;
            
            // Отправляем обновление отправителю
            const senderConnection = connections.find(c => c.userId === sender_id);
            if (senderConnection) {
              senderConnection.ws.send(JSON.stringify({
                type: 'message_sent',
                tempId: data.tempId, // передаем временный ID
                message: newMessage
              }));
            }
            
            // Отправляем сообщение получателю
            const receiverConnection = connections.find(c => c.userId === receiverId);
            if (receiverConnection) {
              receiverConnection.ws.send(JSON.stringify({
                type: 'new_message',
                message: newMessage
              }));
            }
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      });
    } catch (error) {
      ws.close();
    }
  });

  return wss;
};

export const notifyChatCreated = (trainerId: number, clientId: number) => {
  const trainerConnection = connections.find(c => c.userId === trainerId);
  const clientConnection = connections.find(c => c.userId === clientId);

  if (trainerConnection) {
    trainerConnection.ws.send(JSON.stringify({
      type: 'chat_created',
      trainerId,
      clientId
    }));
  }

  if (clientConnection) {
    clientConnection.ws.send(JSON.stringify({
      type: 'chat_created',
      trainerId,
      clientId
    }));
  }
};

export const notifyChatDeleted = (trainerId: number, clientId: number) => {
  const trainerConnection = connections.find(c => c.userId === trainerId);
  const clientConnection = connections.find(c => c.userId === clientId);

  if (trainerConnection) {
    trainerConnection.ws.send(JSON.stringify({
      type: 'chat_deleted',
      trainerId,
      clientId
    }));
  }

  if (clientConnection) {
    clientConnection.ws.send(JSON.stringify({
      type: 'chat_deleted',
      trainerId,
      clientId
    }));
  }
};