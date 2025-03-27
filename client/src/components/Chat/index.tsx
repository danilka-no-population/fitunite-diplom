/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 600px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background-color: #007bff;
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const ChatBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ChatSidebar = styled.div`
  width: 30%;
  border-right: 1px solid #eee;
  overflow-y: auto;
`;

const ChatContent = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatListItem = styled.li<{ active: boolean }>`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#f5f5f5' : 'white')};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

// const Message = styled.div<{ isMe: boolean }>`
//   margin-bottom: 10px;
//   display: flex;
//   justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
// `;

// const MessageContent = styled.div<{ isMe: boolean }>`
//   max-width: 80%;
//   padding: 8px 12px;
//   border-radius: 15px;
//   background-color: ${({ isMe }) => (isMe ? '#007bff' : '#f1f1f1')};
//   color: ${({ isMe }) => (isMe ? 'white' : 'black')};
// `;

// const MessageTime = styled.div`
//   font-size: 12px;
//   color: #999;
//   margin-top: 4px;
// `;

const ChatInput = styled.div`
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;

const UnreadBadge = styled.span`
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 5px;
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 1000;
`;

const MessageContainer = styled.div<{ isMe: boolean }>`
  display: flex;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
  width: 100%;
`;

const MessageBubble = styled.div<{ isMe: boolean }>`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${({ isMe }) => (isMe ? '#007bff' : '#e5e5ea')};
  color: ${({ isMe }) => (isMe ? 'white' : 'black')};
  word-wrap: break-word;
  position: relative;

  transition: all 0.2s ease;
  transform: translateY(${({ isMe }) => (isMe ? '5px' : '-5px')});
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;

  @keyframes fadeIn {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const MessageTime = styled.div<{ isMe: boolean }>`
  font-size: 11px;
  color: ${({ isMe }) => (isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)')};
  margin-top: 5px;
  text-align: right;
`;

const MessageStatus = styled.span<{ isRead: boolean }>`
  margin-left: 5px;
  color: ${({ isRead }) => (isRead ? '#4fc3f7' : 'rgba(255,255,255,0.5)')};
`;

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('token');
    //@ts-ignore
    const user: any = jwtDecode(token);

  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const response = await api.get('/chat');
        setChats(response.data);
        if (response.data.length > 0) {
          setSelectedChat(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/chat/unread-count');
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
    fetchUnreadCount();

    // WebSocket соединение
    const socket = new WebSocket(`ws://localhost:5000?token=${token}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.message]);
      } 
      else if (data.type === 'message_sent') {
        // Заменяем временное сообщение на постоянное из БД
        setMessages(prev => prev.map(msg => 
          msg.id === data.tempId ? data.message : msg
        ));
      }
      else if (data.type === 'chat_created') {
        fetchChats();
      } 
      else if (data.type === 'chat_deleted') {
        setChats(prev => prev.filter(chat => 
          !(chat.trainer_id === data.trainer_id && chat.client_id === data.client_id)
        ));
        if (selectedChat && 
            selectedChat.trainer_id === data.trainer_id && 
            selectedChat.client_id === data.client_id) {
          setSelectedChat(null);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [token]);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/chat/${selectedChat.id}/messages`);
          setMessages(response.data);
          scrollToBottom();
        } catch (error) {
          console.error(error);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, messages]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: behavior
      });
    }
  };

  // const handleSendMessage = async () => {
  //   if (!newMessage.trim() || !selectedChat || !selectedChat.id || !ws) return;
  //   //@ts-ignore
  //   const user: any = jwtDecode(token);

  //   try {
  //     const response = await api.post(`/chat/${selectedChat.id}/messages`, {
  //       message: newMessage
  //     });
      
  //     // Используем сообщение из ответа сервера вместо временного
  //     setMessages(prev => [...prev, response.data]);
  //     setNewMessage('');
  //     scrollToBottom();
      
  //     // Отправка через WebSocket
  //     ws.send(JSON.stringify({
  //       type: 'message',
  //       chat_id: selectedChat.id,
  //       sender_id: user.id,
  //       message: newMessage
  //     }));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !ws) return;
    //@ts-ignore
    const user: any = jwtDecode(token);
    const tempId = Date.now(); // Временный ID для оптимистичного обновления
  
    try {
      // Оптимистичное обновление
      const tempMessage = {
        id: tempId,
        chat_id: selectedChat.id,
        sender_id: user.id,
        message: newMessage,
        sent_at: new Date().toISOString(),
        is_read: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      scrollToBottom();
      
      // Отправляем только через WebSocket
      ws.send(JSON.stringify({
        type: 'message',
        chat_id: selectedChat.id,
        sender_id: user.id,
        message: newMessage
      }));
    } catch (error) {
      console.error(error);
      // Откатываем оптимистичное обновление в случае ошибки
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const getChatName = (chat: any) => {
    //@ts-ignore
    const user: any = jwtDecode(token);
    if (user.role === 'trainer') {
      return chat.client_username;
    } else {
      return chat.trainer_username;
    }
  };

  const getChatAvatar = (chat: any) => {
    //@ts-ignore
    const user: any = jwtDecode(token);
    if (user.role === 'trainer') {
      return chat.client_avatar || 'http://localhost:5000/uploads/default.png';
    } else {
      return chat.trainer_avatar || 'http://localhost:5000/uploads/default.png';
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    // Используем setTimeout для гарантии, что DOM обновился
    setTimeout(() => {
      scrollToBottom('auto'); // 'auto' вместо 'smooth' для мгновенного скролла
    }, 0);
  };

  if (!isOpen) {
    return (
      <ChatButton onClick={handleOpenChat}>
        💬
        {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
      </ChatButton>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader onClick={() => setIsOpen(false)}>
        <span>Chat</span>
        <span>×</span>
      </ChatHeader>
      <ChatBody>
        <ChatSidebar>
          <ChatList>
            {chats.length > 0 ? (
              chats.map(chat => (
                <ChatListItem 
                  key={chat.id}
                  active={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div style={{alignItems: 'center'}}>
                    <img 
                      src={getChatAvatar(chat)} 
                      alt={getChatName(chat)} 
                      style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
                    />
                    {getChatName(chat)}
                  </div>
                  {/* Здесь можно добавить индикатор непрочитанных сообщений */}
                </ChatListItem>
              ))
            ) : (
              <div style={{ padding: 10 }}>
                {
                  //@ts-ignore
                jwtDecode(token).role === 'trainer' 
                  ? 'У вас пока нет клиентов' 
                  : 'У вас пока что нет тренера'}
              </div>
            )}
          </ChatList>
        </ChatSidebar>
        <ChatContent>
          {selectedChat ? (
            <>
              <ChatMessages ref={messagesContainerRef}>
                {/* {messages.map(message => (
                  <Message key={message.id} isMe={message.sender_id === parseInt(localStorage.getItem('userId') || '0')}>
                    <MessageContent isMe={message.sender_id === parseInt(localStorage.getItem('userId') || '0')}>
                      {message.message}
                      <MessageTime>
                        {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {message.sender_id === parseInt(localStorage.getItem('userId') || '0') && (
                          <span style={{color: 'white'}}> {message.is_read ? '✔✔' : '✔'}</span>
                        )}
                      </MessageTime>
                    </MessageContent>
                  </Message>
                ))} */}
                {messages.map(message => {
                  const isMe = message.sender_id === user.id;
                  return (
                    <MessageContainer key={message.id} isMe={isMe}>
                      <MessageBubble isMe={isMe}>
                        {message.message}
                        <MessageTime isMe={isMe}>
                          {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && (
                            <MessageStatus isRead={message.is_read}>
                              {message.is_read ? '✓✓' : '✓'}
                            </MessageStatus>
                          )}
                        </MessageTime>
                      </MessageBubble>
                    </MessageContainer>
                  );
                })}
                <div ref={messagesEndRef} />
              </ChatMessages>
              <ChatInput>
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <SendButton onClick={handleSendMessage}>Send</SendButton>
              </ChatInput>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              {
                //@ts-ignore
              jwtDecode(token).role === 'trainer' 
                ? 'Выберите чат с клиентом' 
                : 'Нет активного чата'}
            </div>
          )}
        </ChatContent>
      </ChatBody>
    </ChatContainer>
  );
};

export default Chat;