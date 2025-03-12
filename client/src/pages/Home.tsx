import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    text-align: center;
`;

const Home: React.FC = () => {
    return (
        <Container>
            <h1>Welcome to FitUnite!</h1>
            <p>Track your workouts, meals, and progress with ease.</p>
        </Container>
    );
};

export default Home;