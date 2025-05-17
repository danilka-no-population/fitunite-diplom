/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WorkoutList from '../components/WorkoutList';
import AddWorkout from '../components/AddWorkout';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api'
import WorkoutDetailsModal from '../components/WorkoutDetailsModal';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #05396B;
  font-size: 2rem;
  margin-bottom: 20px;

  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 500px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.4rem;
  }
`;

// Добавим стили для блока назначенных тренировок
const AssignedWorkoutsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const WorkoutCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const WorkoutName = styled.h3`
  color: #05396B;
  margin: 0 0 0.5rem 0;
`;

const WorkoutDate = styled.p`
  color: #666;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  background-color: ${props => 
    props.status === 'completed' ? '#058E3A' : 
    props.status === 'pending' ? '#FFC107' : '#A80003'};
  color: white;
`;

const Workouts: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [assignedWorkouts, setAssignedWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchAssignedWorkouts = async () => {
    try {
      const response = await api.get('/workouts/assigned/my');
      setAssignedWorkouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWorkoutAdded = () => {
    setRefresh(!refresh);
    fetchAssignedWorkouts();
  };

  useEffect(() => {
    fetchAssignedWorkouts();
  }, []);

  const handleWorkoutClick = (workout: any) => {
    setSelectedWorkout(workout);
    setModalIsOpen(true);
  };


  const handleCompleteWorkout = async () => {
    try {
      await api.put(`/workouts/${selectedWorkout.id}/status`, { status: 'completed' });
      setRefresh(!refresh);
      fetchAssignedWorkouts();
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSkipWorkout = async () => {
    try {
      await api.put(`/workouts/${selectedWorkout.id}/status`, { status: 'skipped' });
      setRefresh(!refresh);
      fetchAssignedWorkouts();
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <ScrollReveal delay={0.05}><Title>Дневник тренировок</Title></ScrollReveal>
      {assignedWorkouts.length > 0 && (
        <ScrollReveal delay={0.1}>
          <AssignedWorkoutsSection>
            {assignedWorkouts.length !== 0 && (
              <SectionTitle>Назначенные тренировки</SectionTitle>
            )}
            {assignedWorkouts.map(workout => {
              if(workout.status === 'pending'){
                return (
                  <WorkoutCard key={workout.id} onClick={() => handleWorkoutClick(workout)}>
                    <WorkoutName>
                      {workout.name}
                      <StatusBadge status={workout.status}>
                        {workout.status === 'completed' ? 'Выполнена' : 
                        workout.status === 'pending' ? 'Ожидает' : 'Пропущена'}
                      </StatusBadge>
                    </WorkoutName>
                    <WorkoutDate>
                      Назначена на: {new Date(workout.date).toLocaleDateString('ru-RU')}
                    </WorkoutDate>
                    <WorkoutDate>
                      Тип: {workout.type}
                    </WorkoutDate>
                  </WorkoutCard>
                )
              }
            })}
          </AssignedWorkoutsSection>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.15}><AddWorkout onWorkoutAdded={handleWorkoutAdded} /></ScrollReveal>
      <WorkoutList refresh={refresh} />

      {modalIsOpen && selectedWorkout && (
        <WorkoutDetailsModal
          workout={selectedWorkout}
          onClose={() => setModalIsOpen(false)}
          onComplete={handleCompleteWorkout}
          onSkip={handleSkipWorkout}
        />
      )}
    </Container>
  );
};

export default Workouts;