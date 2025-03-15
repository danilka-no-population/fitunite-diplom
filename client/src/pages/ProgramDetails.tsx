/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await api.get(`/programs/${id}`);
        setProgram(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProgram();
  }, [id]);

  if (!program) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>{program.name}</h1>
      <p>{program.description}</p>
      <p>Author: {program.author_username}</p>
      <p>Created at: {new Date(program.created_at).toLocaleDateString()}</p>
    </Container>
  );
};

export default ProgramDetail;