import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Workouts: React.FC = () => {
    return (
        <Container>
            <h1>My Workouts</h1>
            <p>Here you can view and manage your workouts.</p>
        </Container>
    );
};

export default Workouts;