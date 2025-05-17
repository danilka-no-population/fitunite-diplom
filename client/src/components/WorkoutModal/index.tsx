/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

const ModalContent = styled.div`
  padding: 30px;
  background: white;
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #05396B;
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #A80003;
  }
`;

const WorkoutInfo = styled.div`
  margin-bottom: 20px;
`;

const ExerciseCard = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e0e9ff;
  border-radius: 10px;
  background-color: #f5f9ff;
`;

const ExerciseName = styled.h4`
  color: #05396B;
  margin-bottom: 10px;
`;

const ExerciseDetail = styled.p`
  color: #666;
  margin-bottom: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button<{ color?: string }>`
  padding: 12px 24px;
  background-color: ${props => props.color === 'danger' ? '#A80003' : '#058E3A'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.color === 'danger' ? '#930204' : '#046b2d'};
  }
`;

const WorkoutModal: React.FC<{
  isOpen: boolean;
  onRequestClose: () => void;
  workout: any;
  onStatusUpdate: (completed: boolean) => void;
}> = ({ isOpen, onRequestClose, workout, onStatusUpdate }) => {
  if (!workout) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Workout Details"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        },
        content: {
          position: 'relative',
          inset: 'auto',
          border: 'none',
          background: 'none',
          overflow: 'hidden',
          width: '90%',
          maxWidth: '800px',
          padding: 0
        }
      }}
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>×</CloseButton>
        <ModalTitle>{workout.name || `Тренировка ${workout.id}`}</ModalTitle>
        
        <WorkoutInfo>
          <p><strong>Дата:</strong> {new Date(workout.date).toLocaleDateString('ru-RU')}</p>
          <p><strong>Тип:</strong> {workout.type}</p>
          <p><strong>Длительность:</strong> {workout.duration} мин.</p>
          {workout.description && <p><strong>Описание:</strong> {workout.description}</p>}
          <p>
            <strong>Статус:</strong> 
            <span style={{ color: workout.completed ? '#058E3A' : '#A80003', marginLeft: '10px' }}>
              {workout.completed ? 'Выполнена' : 'Не выполнена'}
            </span>
          </p>
        </WorkoutInfo>

        <h3>Упражнения:</h3>
        {workout.exercises?.map((exercise: any) => (
          <ExerciseCard key={exercise.id}>
            <ExerciseName>{exercise.name} ({exercise.category})</ExerciseName>
            {exercise.category === 'Бег' ? (
              <>
                <ExerciseDetail>Продолжительность: {exercise.duration} мин.</ExerciseDetail>
                <ExerciseDetail>Дистанция: {exercise.distance} км</ExerciseDetail>
              </>
            ) : (
              <>
                <ExerciseDetail>Подходы: {exercise.sets}</ExerciseDetail>
                <ExerciseDetail>Повторения: {exercise.reps}</ExerciseDetail>
                {exercise.weight > 0 && (
                  <ExerciseDetail>Вес: {exercise.weight} кг</ExerciseDetail>
                )}
              </>
            )}
          </ExerciseCard>
        ))}

        {!workout.completed && (
          <ButtonGroup>
            <Button onClick={() => onStatusUpdate(true)}>
              Я выполнил тренировку
            </Button>
            <Button 
              color="danger" 
              onClick={() => onStatusUpdate(false)}
            >
              Я не выполнил тренировку
            </Button>
          </ButtonGroup>
        )}
      </ModalContent>
    </Modal>
  );
};

export default WorkoutModal;