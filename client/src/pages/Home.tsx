import React from 'react';
import styled from 'styled-components';
import ScrollReveal from '../components/ScrollReveal';

const Container = styled.div`
    padding: 20px;
    text-align: center;
`;

const Home: React.FC = () => {
    return (
        <Container>
            <ScrollReveal delay={0.05}><h1>Добро пожаловать в FitUnite!</h1></ScrollReveal>
        </Container>
    );
};

export default Home;