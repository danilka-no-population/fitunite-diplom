// client/src/components/AssignedWorkoutList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { useParams } from 'react-router-dom';
import WorkoutDetailsModal from '../WorkoutDetailsModal';
import ScrollReveal from '../ScrollReveal';
import Pagination from '../Pagination';

const Container = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const WorkoutCard = styled.div<{ completed: boolean }>`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid ${props => props.completed ? '#058E3A' : '#A80003'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const WorkoutName = styled.h3`
  color: #05396B;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const WorkoutMeta = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const StatusBadge = styled.span<{ completed: boolean }>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.completed ? '#058E3A20' : '#A8000320'};
  color: ${props => props.completed ? '#058E3A' : '#A80003'};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: #666;
`;

interface AssignedWorkout {
  id: number;
  workout_id: number;
  name: string;
  description: string;
  type: string;
  duration: number;
  target_date: string;
  completed: boolean;
  completed_date: string | null;
  status: string;
}

const AssignedWorkoutsList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workouts, setWorkouts] = useState<AssignedWorkout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<AssignedWorkout | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 3;

  const fetchWorkouts = async () => {
    try {
      const response = await api.get(`/workouts/client/${id}/assigned`);
      setWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [id, modalIsOpen]);

  const handleWorkoutClick = (workout: AssignedWorkout) => {
    setSelectedWorkout(workout);
    setModalIsOpen(true);
  };

  const handleComplete = async (workoutId: number) => {
    try {
      await api.put(`/workouts/${workoutId}/status`, { status: 'completed' });
      fetchWorkouts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUncomplete = async (workoutId: number) => {
    try {
      await api.put(`/workouts/${workoutId}/status`, { status: 'skipped' });
      fetchWorkouts();
    } catch (error) {
      console.error(error);
    }
  };

  // Пагинация
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const totalPages = Math.ceil(workouts.length / workoutsPerPage);

  return (
    <Container>
      <ScrollReveal>
      {currentWorkouts.length !== 0 && (
        <Title>Назначенные тренировки</Title>
      )}
        
        {currentWorkouts.length === 0 ? (
          <EmptyMessage>Нет назначенных тренировок</EmptyMessage>
        ) : (
          <>
            {currentWorkouts.map(workout => {
              if (workout.status === 'pending'){
                return (
                  <WorkoutCard 
                    key={workout.id} 
                    completed={workout.completed}
                    onClick={() => handleWorkoutClick(workout)}
                  >
                    <WorkoutName>{workout.name}</WorkoutName>
                    <WorkoutMeta>Тип: {workout.type}</WorkoutMeta>
                    <WorkoutMeta>Длительность: {workout.duration} мин.</WorkoutMeta>
                    <WorkoutMeta>
                      Назначена на: {new Date(workout.target_date).toLocaleDateString('ru-RU')}
                    </WorkoutMeta>
                    <StatusBadge completed={workout.completed}>
                      {workout.completed ? 'Выполнена' : 'Не выполнена'}
                    </StatusBadge>
                  </WorkoutCard>
                )
              }
            })}
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={setCurrentPage}
              />
            )}
          </>
        )}
      </ScrollReveal>

      <WorkoutDetailsModal
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        workout={selectedWorkout}
        onComplete={() => selectedWorkout && handleComplete(selectedWorkout.id)}
        onSkip={() => selectedWorkout && handleUncomplete(selectedWorkout.id)}
      />
    </Container>
  );
};

export default AssignedWorkoutsList;