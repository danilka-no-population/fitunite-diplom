import React, { useState } from 'react';
import styled from 'styled-components';
import MealList from '../components/MealList';
import AddMeal from '../components/AddMeal';

const Container = styled.div`
  padding: 20px;
`;

const Meals: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleMealAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <AddMeal onMealAdded={handleMealAdded} />
      <MealList refresh={refresh} />
    </Container>
  );
};

export default Meals;