import React from 'react';
import styled from 'styled-components';

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
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;

  &.primary {
    background-color: #058E3A;
    color: white;

    &:hover {
      background-color: #046b2d;
    }
  }

  &.secondary {
    background-color: #F5F5F5;
    color: #333;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

interface TrainerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
}

const TrainerRequestModal: React.FC<TrainerRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  username
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Подтверждение запроса</ModalTitle>
        <p>Вы действительно хотите отправить запрос на тренерство клиенту {username}?</p>
        
        <ModalActions>
          <Button className="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button className="primary" onClick={onConfirm}>
            Подтвердить
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TrainerRequestModal;