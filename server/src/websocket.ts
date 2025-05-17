import WebSocket, { WebSocketServer, RawData } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import pool from './config/db';
import ChatModel from './models/Chat';

interface UserConnection {
  userId: number;
  ws: WebSocket;
}

const connections: UserConnection[] = [];

export const setupWSServer = (server: any) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
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

      ws.on('message', async (message: RawData) => {
        try {
          const data = JSON.parse(message.toString());

          if (data.type === 'message') {
            const { chat_id, sender_id, message: text } = data;

            const chatCheck = await pool.query(
              `SELECT c.trainer_id, c.client_id, 
              CASE WHEN u.trainer_id IS NOT NULL THEN true ELSE false END as is_active
              FROM chats c
              LEFT JOIN users u ON c.client_id = u.id AND c.trainer_id = u.trainer_id
              WHERE c.id = $1`,
              [chat_id]
            );

            if (!chatCheck.rows.length || !chatCheck.rows[0].is_active) {
              console.error(`Chat with id ${chat_id} is not active`);
              
              if (chatCheck.rows.length) {
                const chat = chatCheck.rows[0];
                await ChatModel.delete(chat.trainer_id, chat.client_id);
                notifyChatDeleted(chat.trainer_id, chat.client_id);
              }

              return;
            }

            const newMessage = await ChatModel.createMessage({
              chat_id,
              sender_id,
              message: text
            });

            const chat = chatCheck.rows[0];
            const receiverId = chat.trainer_id === sender_id ? chat.client_id : chat.trainer_id;

            const senderConnection = connections.find(c => c.userId === sender_id);
            if (senderConnection) {
              senderConnection.ws.send(JSON.stringify({
                type: 'message_sent',
                tempId: data.tempId,
                message: newMessage
              }));
            }

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