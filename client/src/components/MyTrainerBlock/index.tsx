// client/src/components/MyTrainerBlock.tsx
import React from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const TrainerBlock = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const TrainerTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #05396B;
`;

const TrainerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const TrainerAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
`;

const TrainerDetails = styled.div`
  flex: 1;
`;

const TrainerName = styled.h4`
  margin: 0;
  color: #05396B;
  font-size: 1.1rem;
`;

const TrainerSpecialization = styled.p`
  margin: 0.3rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const TrainerPhone = styled.p`
  margin: 0.3rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #A80003;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: #8a0002;
  }
`;

interface MyTrainerBlockProps {
  trainer: {
    id: number;
    fullname: string;
    username: string;
    phone_number: string;
    specialization: string;
    avatar: string;
  };
  onRemove: () => void;
}

const MyTrainerBlock: React.FC<MyTrainerBlockProps> = ({ trainer, onRemove }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleRemoveClick = () => {
    setIsConfirming(true);
  };

  const confirmRemove = async () => {
    try {
      await api.post('/profile/remove-client', { clientId: trainer.id });
      onRemove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TrainerBlock>
      <TrainerTitle>Мой тренер</TrainerTitle>
      <TrainerInfo>
        <TrainerAvatar src={trainer.avatar || 'http://localhost:5000/uploads/default.png'} alt={trainer.fullname || trainer.username} />
        <TrainerDetails>
          <TrainerName>{trainer.fullname || '@' + trainer.username}</TrainerName>
          <TrainerSpecialization>{trainer.specialization || 'Специализация не указана'}</TrainerSpecialization>
          {trainer.phone_number && <TrainerPhone>Телефон: {trainer.phone_number}</TrainerPhone>}
        </TrainerDetails>
      </TrainerInfo>
      
      {isConfirming ? (
        <div>
          <p>Вы действительно хотите перестать быть клиентом {trainer.fullname || trainer.username}?</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <RemoveButton onClick={confirmRemove}>Да, подтверждаю</RemoveButton>
            <button 
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
              onClick={() => setIsConfirming(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <RemoveButton onClick={handleRemoveClick}>
          Перестать быть клиентом {trainer.fullname || trainer.username}
        </RemoveButton>
      )}
    </TrainerBlock>
  );
};

export default MyTrainerBlock;