import React from 'react';
import styled from 'styled-components';
import ProgressCharts from '../components/ProgressCharts';

const Container = styled.div`
    padding: 20px;
`;

const Progress: React.FC<{ userId?: number }> = ({ userId }) => {
    return (
        <Container>
            <Container>
                <h1>My Progress</h1>
            </Container>
            <Container>
                <p>Here you can track your progress over time.</p>
            </Container>
            <ProgressCharts userId={userId}/>
        </Container>
    );
};

export default Progress;