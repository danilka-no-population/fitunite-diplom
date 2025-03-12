import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`;

const Progress: React.FC = () => {
    return (
        <Container>
            <h1>My Progress</h1>
            <p>Here you can track your progress over time.</p>
        </Container>
    );
};

export default Progress;