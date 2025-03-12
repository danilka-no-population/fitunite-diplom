import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Meals: React.FC = () => {
    return (
        <Container>
            <h1>My Meals</h1>
            <p>Here you can view and manage your meals.</p>
        </Container>
    );
};

export default Meals;