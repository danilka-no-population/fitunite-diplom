import React, { useState } from 'react';
import styled from 'styled-components';
import WorkoutList from '../components/WorkoutList';
import AddWorkout from '../components/AddWorkout';

const Container = styled.div`
  padding: 20px;
`;

const Workouts: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleWorkoutAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <AddWorkout onWorkoutAdded={handleWorkoutAdded} />
      <WorkoutList refresh={refresh} />
    </Container>
  );
};

export default Workouts;