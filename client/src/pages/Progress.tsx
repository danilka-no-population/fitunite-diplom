import React from 'react';
import styled from 'styled-components';
import ProgressCharts from '../components/ProgressCharts';

const Container = styled.div`
    padding: 20px;
`;

const Progress: React.FC = () => {
    return (
        <Container>
            <Container>
                <h1>My Progress</h1>
            </Container>
            <Container>
                <p>Here you can track your progress over time.</p>
            </Container>
            <ProgressCharts/>
        </Container>
    );
};

export default Progress;