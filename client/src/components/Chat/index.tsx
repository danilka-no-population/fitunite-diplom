/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import ScrollReveal from '../ScrollReveal';

interface UnreadCounts {
  [chatId: number]: number;
}

const ChatButtonWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #05396B;
  color: white;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #A80003;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  padding: 0 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 90vw;
  max-width: 600px;
  height: 70vh;
  min-height: 400px;
  max-height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 95vw;
    right: 10px;
    bottom: 10px;
    height: 80vh;
    max-height: 80vh;
    min-height: 300px;
  }

  @media (max-width: 320px) {
    width: 100vw;
    right: 0;
    bottom: 0;
    border-radius: 20px 20px 0 0;
    height: 90vh;
  }
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  background-color: #05396B;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  flex-shrink: 0;
`;

const ChatBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ChatSidebar = styled.div`
  width: 100%;
  border-bottom: 1px solid #e0e9ff;
  overflow-y: auto;
  background-color: #f5f9ff;
  flex-shrink: 0;
  height: fit-content;

  @media (min-width: 768px) {
    width: 35%;
    height: auto;
    border-right: 1px solid #e0e9ff;
    border-bottom: none;
  }
`;

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatListItem = styled.li<{ active: boolean, hasUnread: boolean }>`
  padding: 12px 15px;
  border-bottom: 1px solid #e0e9ff;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#e0e9ff' : 'transparent')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${({ hasUnread }) => (hasUnread ? '600' : 'normal')};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: #e0e9ff;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  flex: 1;
`;

const UserName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #05396B;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ChatInput = styled.div`
  padding: 10px 15px;
  border-top: 1px solid #e0e9ff;
  display: flex;
  background-color: white;
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e0e9ff;
  border-radius: 30px;
  outline: none;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #5CDB94;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 0 15px;
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
  min-width: 80px;
  
  &:hover {
    background-color: #046b2d;
  }
  
  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    min-width: 70px;
    font-size: 13px;
  }
`;

const MessageContainer = styled.div<{ isMe: boolean }>`
  display: flex;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
  animation: fadeIn 0.3s ease forwards;
  max-width: 100%;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MessageBubble = styled.div<{ isMe: boolean }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  background-color: ${({ isMe }) => (isMe ? '#5CDB94' : '#e0e9ff')};
  color: ${({ isMe }) => (isMe ? 'white' : '#05396B')};
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    max-width: 85%;
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const MessageTime = styled.div<{ isMe: boolean }>`
  font-size: 11px;
  color: ${({ isMe }) => (isMe ? 'rgba(255,255,255,0.7)' : 'rgba(5,57,107,0.5)')};
  margin-top: 4px;
  text-align: right;
`;

const MessageStatus = styled.span<{ isRead: boolean }>`
  margin-left: 5px;
  color: ${({ isRead }) => (isRead ? '#29b000' : '#0000ff')};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
`;

const UnreadCountBadge = styled.span<{ count: number }>`
  background-color: #A80003;
  color: white;
  border-radius: 50%;
  padding: ${({ count }) => count > 9 ? '4px 6px' : '4px 8px'};
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
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
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});

  const token = localStorage.getItem('token');
  //@ts-ignore
  const user: any = jwtDecode(token);

  const fetchUnreadCounts = async () => {
    try {
      const response = await api.get('/chat/unread-counts');
      const counts: UnreadCounts = {};
      response.data.forEach((item: { chat_id: number, unread_count: number }) => {
        counts[item.chat_id] = item.unread_count;
      });
      setUnreadCounts(counts);
      
      // Для клиента считаем только сообщения от тренера
      const total = user.role === 'client'
        ? response.data.reduce((sum: number, item: any) => sum + item.unread_count, 0)
        : Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      setUnreadCount(total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [chatsResponse, countsResponse] = await Promise.all([
          api.get('/chat'),
          api.get('/chat/unread-counts')
        ]);
        
        setChats(chatsResponse.data);
        
        const counts: UnreadCounts = {};
        countsResponse.data.forEach((item: { chat_id: number, unread_count: number }) => {
          counts[item.chat_id] = item.unread_count;
        });
        setUnreadCounts(counts);
        
        // Устанавливаем общее количество непрочитанных
        const total = user.role === 'client'
          ? countsResponse.data.reduce((sum: number, item: any) => sum + item.unread_count, 0)
          : Object.values(counts).reduce((sum, count) => sum + count, 0);
        
        setUnreadCount(total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    // WebSocket соединение
    const socket = new WebSocket(`ws://localhost:5000?token=${token}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_message') {
        setMessages(prev => [...prev, data.message]);
        
        // Для клиента увеличиваем счетчик только если чат не открыт
        if (user.role === 'client' && !isOpen) {
          setUnreadCount(prev => prev + 1);
          setUnreadCounts(prev => ({
            ...prev,
            [data.message.chat_id]: (prev[data.message.chat_id] || 0) + 1
          }));
        } else {
          fetchUnreadCounts();
        }
      }
      else if (data.type === 'message_sent') {
        setMessages(prev => prev.map(msg => 
          msg.id === data.tempId ? data.message : msg
        ));
      }
      else if (data.type === 'chat_created') {
        fetchData();
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
        fetchUnreadCounts();
      }
    };

    return () => {
      socket.close();
    };
  }, [token, isOpen]);

  const handleSelectChat = async (chat: any) => {
    setSelectedChat(chat);
    try {
      const response = await api.get(`/chat/${chat.id}/messages`);
      setMessages(response.data);
      scrollToBottom();
      
      // Помечаем как прочитанные
      await api.get(`/chat/${chat.id}/messages`);
      
      // Обновляем счетчики
      fetchUnreadCounts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedChat && isOpen) {
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
  }, [selectedChat, isOpen]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: behavior
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !ws) return;
    const tempId = Date.now();
  
    try {
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
      // scrollToBottom();
      
      ws.send(JSON.stringify({
        type: 'message',
        chat_id: selectedChat.id,
        sender_id: user.id,
        message: newMessage
      }));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    
    // Для клиента автоматически выбираем чат с тренером при открытии
    if (user.role === 'client' && chats.length > 0) {
      setSelectedChat(chats[0]);
      
      // Помечаем сообщения как прочитанные
      setTimeout(async () => {
        try {
          await api.get(`/chat/${chats[0].id}/messages`);
          fetchUnreadCounts();
        } catch (error) {
          console.error(error);
        }
      }, 0);
    }
    
    setTimeout(() => scrollToBottom('auto'), 0);
  };

  useEffect(() => {
    if (isOpen && selectedChat) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [selectedChat, isOpen, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getChatName = (chat: any) => {
    return user.role === 'trainer' ? chat.client_username : chat.trainer_username;
  };

  const getChatAvatar = (chat: any) => {
    return user.role === 'trainer' 
      ? chat.client_avatar || 'http://localhost:5000/uploads/default.png'
      : chat.trainer_avatar || 'http://localhost:5000/uploads/default.png';
  };

  // if (!isOpen) {
  //   return (
  //     <ChatButton onClick={handleOpenChat}>
  //       💬
  //       {unreadCount > 0 && <UnreadBadge count={unreadCount}>{unreadCount > 10 ? '10+' : unreadCount}</UnreadBadge>}
  //     </ChatButton>
  //   );
  // }

  return (
    <>
      {!isOpen ? (
        
        <ChatButtonWrapper>
        <ChatButton onClick={handleOpenChat}>
          💬
          {unreadCount > 0 && (
            <UnreadBadge>
              {unreadCount > 99 ? '99+' : unreadCount}
            </UnreadBadge>
          )}
        </ChatButton>
      </ChatButtonWrapper>
      ) : (
        <ChatContainer>
          <ChatHeader>
            <span>Сообщения</span>
            <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          </ChatHeader>
          <ChatBody>
          <ChatSidebar>
              <ChatList>
                {chats.length > 0 ? (
                  chats.map(chat => (
                    <ChatListItem 
                      key={chat.id}
                      active={selectedChat?.id === chat.id}
                      onClick={() => handleSelectChat(chat)}
                      hasUnread={unreadCounts[chat.id] > 0}
                    >
                      <UserInfo>
                        <Avatar 
                          src={getChatAvatar(chat)} 
                          alt={getChatName(chat)} 
                        />
                        <UserName>{getChatName(chat)}</UserName>
                      </UserInfo>
                      {unreadCounts[chat.id] > 0 && (
                        <UnreadCountBadge count={unreadCounts[chat.id]}>
                          {unreadCounts[chat.id] > 99 ? '99+' : unreadCounts[chat.id]}
                        </UnreadCountBadge>
                      )}
                    </ChatListItem>
                  ))
                ) : (
                  <EmptyState>
                    {user.role === 'trainer' 
                      ? 'У вас пока нет клиентов' 
                      : 'У вас пока нет тренера'}
                  </EmptyState>
                )}
              </ChatList>
            </ChatSidebar>
            <ChatContent>
              {selectedChat ? (
                <>
                  <ChatMessages ref={messagesEndRef}>
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
                      placeholder="Напишите сообщение..."
                    />
                    <SendButton onClick={handleSendMessage}>
                      Отправить
                    </SendButton>
                  </ChatInput>
                </>
              ) : null}
            </ChatContent>
          </ChatBody>
        </ChatContainer>
      )}
    </>
  );
};

export default Chat;