import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const RequestCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const UserLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex: 1;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h3`
  margin: 0;
  color: #05396B;
  font-size: 1.2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;

  &.accept {
    background-color: #058E3A;
    color: white;

    &:hover {
      background-color: #046b2d;
    }
  }

  &.reject {
    background-color: #A80003;
    color: white;

    &:hover {
      background-color: #8a0002;
    }
  }
`;

interface TrainerRequestItemProps {
  request: {
    id: number;
    trainer_id?: number;
    client_id?: number;
    status: string;
    trainer_username?: string;
    trainer_fullname?: string;
    trainer_avatar?: string;
    client_username?: string;
    client_fullname?: string;
    client_avatar?: string;
  };
  type: 'incoming' | 'outgoing';
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const TrainerRequestItem: React.FC<TrainerRequestItemProps> = ({ 
  request, 
  type, 
  onAccept, 
  onReject,
  onCancel
}) => {
  const user = type === 'incoming' ? {
    id: request.trainer_id,
    username: request.trainer_username,
    fullname: request.trainer_fullname,
    avatar: request.trainer_avatar
  } : {
    id: request.client_id,
    username: request.client_username,
    fullname: request.client_fullname,
    avatar: request.client_avatar
  };

  return (
    <RequestCard>
      <UserLink to={`/profile/${user.id}`}>
        <Avatar src={user.avatar || 'http://localhost:5000/uploads/default.png'} />
        <UserInfo>
          <Username>{user.fullname || `@${user.username}`}</Username>
          <p>@{user.username}</p>
        </UserInfo>
      </UserLink>
      
      {type === 'incoming' && onAccept && onReject && (
        <Actions>
          <Button className="accept" onClick={() => onAccept(request.id)}>
            Принять
          </Button>
          <Button className="reject" onClick={() => onReject(request.id)}>
            Отклонить
          </Button>
        </Actions>
      )}
      
      {type === 'outgoing' && request.status === 'pending' && onCancel && (
        <Actions>
          <Button className="reject" onClick={() => onCancel(request.id)}>
            Отменить
          </Button>
        </Actions>
      )}
      
      {type === 'outgoing' && request.status !== 'pending' && (
        <div style={{ color: request.status === 'accepted' ? '#058E3A' : '#A80003' }}>
          {request.status === 'accepted' ? 'Принят' : 'Отклонен'}
        </div>
      )}
    </RequestCard>
  );
};

export default TrainerRequestItem;