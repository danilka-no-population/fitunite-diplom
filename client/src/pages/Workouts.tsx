import React, { useState } from 'react';
import styled from 'styled-components';
import WorkoutList from '../components/WorkoutList';
import AddWorkout from '../components/AddWorkout';
import ScrollReveal from '../components/ScrollReveal';

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

const Workouts: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleWorkoutAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <ScrollReveal delay={0.05}><Title>Дневник тренировок</Title></ScrollReveal>
      <ScrollReveal delay={0.1}><AddWorkout onWorkoutAdded={handleWorkoutAdded} /></ScrollReveal>
      <WorkoutList refresh={refresh} />
    </Container>
  );
};

export default Workouts;