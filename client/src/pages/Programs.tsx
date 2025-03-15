import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

const ProgramCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const CreateButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #218838;
  }
`;

const ProgramList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [programs, setPrograms] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get('/programs');
        setPrograms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserRole = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role);
      }
    };

    fetchPrograms();
    fetchUserRole();
  }, []);

  return (
    <Container>
      <h1>Training Programs</h1>
      {userRole === 'trainer' && (
        <CreateButton onClick={() => navigate('/create-program')}>
          Create Program
        </CreateButton>
      )}
      {programs.map((program) => (
        <Link to={`/programs/${program.id}`} key={program.id}>
          <ProgramCard>
            <h3>{program.name}</h3>
            <p>{program.description.length > 80 ? `${program.description.substring(0, 80)}...` : program.description}</p>
          </ProgramCard>
        </Link>
      ))}
    </Container>
  );
};

export default ProgramList;