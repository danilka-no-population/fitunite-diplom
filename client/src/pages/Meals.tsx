import React, { useState } from 'react';
import styled from 'styled-components';
import MealList from '../components/MealList';
import AddMeal from '../components/AddMeal';
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
`;

const Meals: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleMealAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <Container>
      <Title>Дневник питания</Title>
      <ScrollReveal><AddMeal onMealAdded={handleMealAdded} /></ScrollReveal>
      <MealList refresh={refresh} />
    </Container>
  );
};

export default Meals;