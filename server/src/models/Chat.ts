import pool from '../config/db';

interface Chat {
  id?: number;
  trainer_id: number;
  client_id: number;
  created_at?: Date;
}

interface Message {
  id?: number;
  chat_id: number;
  sender_id: number;
  message: string;
  sent_at?: Date;
  is_read?: boolean;
}

class ChatModel {
  static async findOrCreate(trainer_id: number, client_id: number): Promise<Chat> {
    const result = await pool.query(
      'INSERT INTO Chats (trainer_id, client_id) VALUES ($1, $2) ON CONFLICT (trainer_id, client_id) DO UPDATE SET trainer_id = $1 RETURNING *',
      [trainer_id, client_id]
    );
    return result.rows[0];
  }

  static async findByTrainerId(trainer_id: number): Promise<Chat[]> {
    const result = await pool.query(
      `SELECT c.*, u.username as client_username, u.avatar as client_avatar 
       FROM Chats c
       JOIN Users u ON c.client_id = u.id
       WHERE c.trainer_id = $1`,
      [trainer_id]
    );
    return result.rows;
  }

  static async findByClientId(client_id: number): Promise<Chat | null> {
    const result = await pool.query(
      `SELECT c.*, u.username as trainer_username, u.avatar as trainer_avatar 
       FROM Chats c
       JOIN Users u ON c.trainer_id = u.id
       WHERE c.client_id = $1`,
      [client_id]
    );
    return result.rows[0] || null;
  }

  static async delete(trainer_id: number, client_id: number): Promise<void> {
    await pool.query(
      'DELETE FROM Chats WHERE trainer_id = $1 AND client_id = $2',
      [trainer_id, client_id]
    );
  }

  static async createMessage(message: Message): Promise<Message> {
    const { chat_id, sender_id, message: text } = message;

      // Добавим проверку на существование чата
    const chatExists = await pool.query(
      'SELECT 1 FROM Chats WHERE id = $1',
      [chat_id]
    );
    
    if (!chatExists.rows.length) {
      throw new Error('Chat does not exist');
    }

    const result = await pool.query(
      'INSERT INTO Messages (chat_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *',
      [chat_id, sender_id, text]
    );
    return result.rows[0];
  }

  static async getMessages(chat_id: number): Promise<Message[]> {
    const result = await pool.query(
      'SELECT * FROM Messages WHERE chat_id = $1 ORDER BY sent_at ASC',
      [chat_id]
    );
    return result.rows;
  }

  static async markAsRead(chat_id: number, user_id: number): Promise<void> {
    await pool.query(
      'UPDATE Messages SET is_read = TRUE WHERE chat_id = $1 AND sender_id != $2 AND is_read = FALSE',
      [chat_id, user_id]
    );
  }

  // static async getUnreadCount(user_id: number): Promise<number> {
  //   const result = await pool.query(
  //     `SELECT COUNT(*) FROM Messages m
  //      JOIN Chats c ON m.chat_id = c.id
  //      WHERE ((c.trainer_id = $1 AND m.sender_id = c.client_id) OR 
  //             (c.client_id = $1 AND m.sender_id = c.trainer_id))
  //      AND m.is_read = FALSE`,
  //     [user_id]
  //   );
  //   return parseInt(result.rows[0].count);
  // }

  static async getUnreadCountsByChat(user_id: number): Promise<{chat_id: number, unread_count: number}[]> {
    const result = await pool.query(
      `SELECT 
        m.chat_id, 
        COUNT(*) as unread_count
      FROM Messages m
      JOIN Chats c ON m.chat_id = c.id
      WHERE ((c.trainer_id = $1 AND m.sender_id = c.client_id) OR 
             (c.client_id = $1 AND m.sender_id = c.trainer_id))
      AND m.is_read = FALSE
      GROUP BY m.chat_id`,
      [user_id]
    );
    return result.rows.map(row => ({
      chat_id: row.chat_id,
      unread_count: parseInt(row.unread_count)
    }));
  }

  static async getUnreadCount(user_id: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM Messages m
       JOIN Chats c ON m.chat_id = c.id
       WHERE ((c.trainer_id = $1 AND m.sender_id = c.client_id) OR 
              (c.client_id = $1 AND m.sender_id = c.trainer_id))
       AND m.is_read = FALSE`,
      [user_id]
    );
    return parseInt(result.rows[0].count);
  }
  
  // Для клиента считаем только сообщения от тренера
  static async getClientUnreadCount(client_id: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM Messages m
       JOIN Chats c ON m.chat_id = c.id
       WHERE c.client_id = $1 
       AND m.sender_id = c.trainer_id
       AND m.is_read = FALSE`,
      [client_id]
    );
    return parseInt(result.rows[0].count);
  }
}

export default ChatModel;