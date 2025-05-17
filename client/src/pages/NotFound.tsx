import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: fit-content;

  @media (max-width: 768px) {
    height: auto;
    padding: 40px 15px;
  }
`;

const Title = styled.h1`
  position: relative;
  color: #fff;
  font-size: 3rem;
  margin-bottom: 20px;
  border-radius: 20px;
  overflow: hidden;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;

  /* Background image */
  background: url('https://static.ctclove.ru/uploads/fileskotiki/zaplakannyi.jpg') no-repeat center center;
  background-size: cover;

  /* Semi-transparent overlay directly on the image */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Semi-transparent dark overlay */
    z-index: 1;
  }

  /* Text styling */
  span {
    position: relative;
    z-index: 2; /* Ensure text is above the overlay */
    font-weight: bold;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6); /* Add text shadow for better visibility */
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    height: 180px;
  }

  @media (max-width: 500px) {
    font-size: 2rem;
    height: 150px;
  }

  @media (max-width: 500px) {
    font-size: 1.5rem;
    height: 125px;
  }
`;

const Message = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #ffffff, #e6f7ff);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  animation: slideIn 1.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 15px 20px;
  }

  @media (max-width: 500px) {
    font-size: 1rem;
    padding: 10px 15px;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: #058E3A;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);

  &:hover {
    background-color: #046b2d;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(5, 142, 58, 0.5);
  }

  @media (max-width: 500px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <ScrollReveal>
        <Title>
          <span>Данная страница не найдена</span>
        </Title>
        <Message>
          К сожалению, запрашиваемая страница не существует. Возможно, вы ввели
          неправильный адрес или страница была удалена.
        </Message>
        <HomeLink to="/">Вернуться на главную</HomeLink>
      </ScrollReveal>
    </Container>
  );
};

export default NotFound;