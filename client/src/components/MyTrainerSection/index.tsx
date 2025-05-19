import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Section = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #05396B;
`;

const TrainerCard = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;

const TrainerInfo = styled.div`
  flex: 1;
`;

const TrainerName = styled.h3`
  margin: 0;
  color: #05396B;
  font-size: 1.2rem;
`;

const TrainerUsername = styled.p`
  margin: 5px 0;
  color: #666;
`;

const TrainerSpecialization = styled.p`
  margin: 5px 0;
  color: #333;
`;

const TrainerPhone = styled.p`
  margin: 5px 0;
  color: #333;
`;



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #05396B;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;

  &.primary {
    background-color: #058E3A;
    color: white;
    min-width: 150px;
    width: 100%;

    &:hover {
      background-color: #046b2d;
    }
  }

  &.secondary {
    background-color: #05396B;
    color: #ffffff;



    &:hover {
      background-color: #2168ab;
    }
  }

  &.guess {
    background-color: #058E3A;
    color: white;



    &:hover {
      background-color: #046b2d;
    }
  }
`;

interface MyTrainerSectionProps {
  trainer: {
    id: number;
    username: string;
    fullname?: string;
    avatar?: string;
    specialization?: string;
    phone_number?: string;
  };
  onRemove: () => void;
}

const MyTrainerSection: React.FC<MyTrainerSectionProps> = ({ trainer, onRemove }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  return (
    <Section>
      <SectionTitle>Мой тренер</SectionTitle>
      <TrainerCard>
        <Link to={`/profile/${trainer.id}`}>
          <Avatar src={trainer.avatar || 'http://localhost:5000/uploads/default.png'} />
        </Link>
        <TrainerInfo>
          <TrainerName>
            <Link to={`/profile/${trainer.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {trainer.fullname || `@${trainer.username}`}
            </Link>
          </TrainerName>
          <TrainerUsername>@{trainer.username}</TrainerUsername>
          {trainer.specialization && (
            <TrainerSpecialization>
              <strong>Специализация:</strong> {trainer.specialization}
            </TrainerSpecialization>
          )}
          {trainer.phone_number && (
            <TrainerPhone>
              <strong>Телефон:</strong> {trainer.phone_number}
            </TrainerPhone>
          )}
        </TrainerInfo>
      </TrainerCard>
      <Button onClick={() => setIsConfirmModalOpen(true)} className='primary'>
        Перестать быть клиентом @{trainer.username}
      </Button>
      {/* Модальное окно подтверждения */}
      {isConfirmModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Подтверждение</ModalTitle>
            <p>Вы действительно хотите прекратить тренировки у @{trainer.username}?</p>
            <ModalActions>
              <Button className="secondary" onClick={() => setIsConfirmModalOpen(false)}>
                Отмена
              </Button>
              <Button 
                className="guess" 
                onClick={() => {
                  onRemove();
                  setIsConfirmModalOpen(false);
                }}
              >
                Подтвердить
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Section>
  );
};

export default MyTrainerSection;