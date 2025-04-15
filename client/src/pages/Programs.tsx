/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ScrollReveal from '../components/ScrollReveal';

const Container = styled.div`
  padding: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#f0f0f0' : 'transparent'};
  border: none;
  border-bottom: ${props => props.active ? '2px solid #007bff' : 'none'};
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
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
  const [publicPrograms, setPublicPrograms] = useState<any[]>([]);
  const [myPrograms, setMyPrograms] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const [userRole, setUserRole] = useState<string>('');
  const [myId, setMyId] = useState<number | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const publicResponse = await api.get('/programs/public');
        setPublicPrograms(publicResponse.data);
        console.log(publicResponse.data)

        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          setUserRole(decodedToken.role);
          setMyId(decodedToken.id)

          if (decodedToken.role === 'trainer') {
            const myResponse = await api.get('/programs/my');
            setMyPrograms(myResponse.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <Container>
      <ScrollReveal><h1>Программы тренировок:</h1></ScrollReveal>
      
      {userRole === 'trainer' && (
        <>
          <ScrollReveal><Tabs>
            <Tab 
              active={activeTab === 'public'}
              onClick={() => setActiveTab('public')}
            >
              Общедоступные программы
            </Tab>
            <Tab 
              active={activeTab === 'my'}
              onClick={() => setActiveTab('my')}
            >
              Мои программы
            </Tab>
          </Tabs></ScrollReveal>

          <ScrollReveal><CreateButton onClick={() => navigate('/create-program')}>
            Создать программу
          </CreateButton></ScrollReveal>
        </>
      )}

      {(activeTab === 'public' || userRole !== 'trainer') && (
        <>
          
          {publicPrograms.map((program) => (
            <Link to={`/programs/${program.id}`} key={program.id}>
              <ScrollReveal><ProgramCard>
                <h3>{program.name}</h3>
                <p>Тип: {program.type}</p>
                <p>Продолжительность: {program.days_count} дней</p>
                <p>Кол-во тренировок: {program.workouts_count}</p>
                {program.author_id === myId && <h4>Это ваша программа</h4>}
              </ProgramCard></ScrollReveal>
            </Link>
          ))}
        </>
      )}

      {activeTab === 'my' && userRole === 'trainer' && (
        <>
          {myPrograms.map((program) => (
            <Link to={`/programs/${program.id}`} key={program.id}>
              <ScrollReveal delay={0.1}><ProgramCard>
                <h3>{program.name}</h3>
                <p>Тип: {program.type}</p>
                <p>Продолжительность: {program.days_count} дней</p>
                <p>Кол-во тренировок: {program.workouts_count}</p>
                <b>{program.is_public ? 'Общедоступная' : 'Приватная'}</b>
              </ProgramCard></ScrollReveal>
            </Link>
          ))}
        </>
      )}
    </Container>
  );
};

export default ProgramList;