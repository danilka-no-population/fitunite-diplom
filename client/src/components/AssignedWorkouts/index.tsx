/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import Modal from 'react-modal';
import ScrollReveal from '../ScrollReveal';

const Container = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const WorkoutCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid ${props => 
    props.status === 'completed' ? '#058E3A' : 
    props.status === 'skipped' ? '#A80003' : '#05396B'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const WorkoutTitle = styled.h3`
  color: #05396B;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const WorkoutMeta = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'completed' ? '#058E3A20' : 
    props.status === 'skipped' ? '#A8000320' : '#05396B20'};
  color: ${props => 
    props.status === 'completed' ? '#058E3A' : 
    props.status === 'skipped' ? '#A80003' : '#05396B'};
`;

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
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #A80003;
  }
`;

const ExerciseCard = styled.div`
  padding: 15px;
  margin: 15px 0;
  background-color: #f5f9ff;
  border: 1px solid #e0e9ff;
  border-radius: 10px;
`;

const ExerciseTitle = styled.h3`
  color: #05396B;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const ExerciseDetail = styled.p`
  color: #666;
  margin-bottom: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.color === 'danger' ? '#A80003' : '#058E3A'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.color === 'danger' ? '#930204' : '#046b2d'};
  }
`;

const AssignedWorkouts: React.FC<{ clientId?: number }> = ({ clientId }) => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const endpoint = clientId 
        ? `/workouts/client/${clientId}/assigned`
        : '/workouts/assigned';
      const response = await api.get(endpoint);
      setWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    console.log(workouts)
  }, [clientId, refresh]);

  const openWorkoutModal = async (workout: any) => {
    try {
      const exercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
      setSelectedWorkout({
        ...workout,
        exercises: exercisesResponse.data
      });
      setModalIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const updateWorkoutStatus = async (status: string) => {
    try {
      await api.patch(`/workouts/${selectedWorkout.id}/status`, { status });
      setRefresh(!refresh);
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      {workouts.length !== 0 && (
        <Title>Назначенные тренировки</Title>
      )}
      
      {workouts.length === 0 ? (
        <p>Нет назначенных тренировок</p>
      ) : (
        workouts.map(workout => (
          <ScrollReveal key={workout.id}>
            {workout.status === 'pending' ? (
              <WorkoutCard 
                onClick={() => openWorkoutModal(workout)}
                status={workout.status}
              >
                <WorkoutTitle>{workout.name || `Тренировка от ${new Date(workout.date).toLocaleDateString()}`}</WorkoutTitle>
                <WorkoutMeta>Дата: {new Date(workout.date).toLocaleDateString()}</WorkoutMeta>
                <WorkoutMeta>Тип: {workout.type}</WorkoutMeta>
                <WorkoutMeta>
                  Статус: <StatusBadge status={workout.status}>
                    {workout.status === 'completed' ? 'Выполнена' : 
                      workout.status === 'skipped' ? 'Пропущена' : 'Назначена'}
                  </StatusBadge>
                </WorkoutMeta>
              </WorkoutCard>
            ) : null}
          </ScrollReveal>
        ))
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
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
        {selectedWorkout && (
          <ModalContent>
            <CloseButton onClick={() => setModalIsOpen(false)}>×</CloseButton>
            <ModalTitle>{selectedWorkout.name || `Тренировка от ${new Date(selectedWorkout.date).toLocaleDateString()}`}</ModalTitle>
            
            <p><strong>Дата:</strong> {new Date(selectedWorkout.date).toLocaleDateString()}</p>
            <p><strong>Тип:</strong> {selectedWorkout.type}</p>
            <p><strong>Длительность:</strong> {selectedWorkout.duration} минут</p>
            {selectedWorkout.description && <p><strong>Описание:</strong> {selectedWorkout.description}</p>}
            
            <h3 style={{ margin: '20px 0 10px', color: '#05396B' }}>Упражнения:</h3>
            
            {selectedWorkout.exercises.map((exercise: any) => (
              <ExerciseCard key={exercise.id}>
                <ExerciseTitle>{exercise.name}</ExerciseTitle>
                {exercise.category === 'Бег' ? (
                  <>
                    <ExerciseDetail><strong>Продолжительность:</strong> {exercise.duration} мин.</ExerciseDetail>
                    <ExerciseDetail><strong>Дистанция:</strong> {exercise.distance} км</ExerciseDetail>
                  </>
                ) : (
                  <>
                    <ExerciseDetail><strong>Подходы:</strong> {exercise.sets}</ExerciseDetail>
                    <ExerciseDetail><strong>Повторения:</strong> {exercise.reps}</ExerciseDetail>
                    {exercise.weight > 0 && (
                      <ExerciseDetail><strong>Вес:</strong> {exercise.weight} кг</ExerciseDetail>
                    )}
                  </>
                )}
              </ExerciseCard>
            ))}
            
            {!clientId && (
              <ButtonGroup>
                <Button onClick={() => updateWorkoutStatus('completed')}>
                  Я выполнил тренировку
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => updateWorkoutStatus('skipped')}
                >
                  Я не выполнил тренировку
                </Button>
              </ButtonGroup>
            )}
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default AssignedWorkouts;