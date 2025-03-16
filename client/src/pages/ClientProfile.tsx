import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${(props) => (props.active ? '#007bff' : '#f9f9f9')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#eee')};
  }
`;

const Content = styled.div`
  margin-top: 20px;
`;

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'workouts' | 'progress' | 'meals'>('profile');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [client, setClient] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/profile/${id}`);
        setClient(response.data);
        setIsClient(response.data.isClient);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchClient();
  }, [id]);

  if (!client) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>{client.fullname || client.username}</h1>
      <Tabs>
        <Tab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          Профиль
        </Tab>
        {isClient && (
          <>
            <Tab active={activeTab === 'workouts'} onClick={() => setActiveTab('workouts')}>
              Тренировки
            </Tab>
            <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
              Прогресс
            </Tab>
            <Tab active={activeTab === 'meals'} onClick={() => setActiveTab('meals')}>
              Питание
            </Tab>
          </>
        )}
      </Tabs>
      <Content>
        {activeTab === 'profile' && (
          <div>
            <p>Username: {client.username}</p>
            <p>Email: {client.email}</p>
            <p>Full Name: {client.fullname || 'Not set'}</p>
            <p>Phone Number: {client.phone_number || 'Not set'}</p>
          </div>
        )}
        {isClient && activeTab === 'workouts' && <div>Workouts content</div>}
        {isClient && activeTab === 'progress' && <div>Progress content</div>}
        {isClient && activeTab === 'meals' && <div>Meals content</div>}
      </Content>
    </Container>
  );
};

export default ClientProfile;