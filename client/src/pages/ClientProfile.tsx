import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import WorkoutList from '../components/WorkoutList';
import MealList from '../components/MealList';
import ProgressCharts from './Progress';

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

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const RemoveButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'workouts' | 'progress' | 'meals'>('profile');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [client, setClient] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const fetchClient = async () => {
    try {
      const response = await api.get(`/profile/${id}`);
      setClient(response.data);
      setIsClient(response.data.isClient);
    } catch (error) {
      console.error(error);
    }
  };


  const handleAddClient = async (clientId: number) => {
    try {
      await api.post('/profile/add-client', { clientId });
      await fetchClient();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveClient = async (clientId: number) => {
    try {
      await api.post('/profile/remove-client', { clientId });
      await fetchClient();
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
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
            <img src={client.avatar || 'http://localhost:5000/uploads/default.png'} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
            <p>Username: {client.username}</p>
            <p>Email: {client.email}</p>
            <p>Full Name: {client.fullname || 'Not set'}</p>
            <p>Phone Number: {client.phone_number || 'Not set'}</p>
            {client.isClient ? (
              <RemoveButton onClick={() => handleRemoveClient(client.id)}>Remove from my clients</RemoveButton>
              ) : (
                  <AddButton onClick={() => handleAddClient(client.id)}>Add Client</AddButton>
            )}
          </div>
        )}
        {isClient && activeTab === 'workouts' && <WorkoutList refresh={false} clientId={Number(id)} />}
        {isClient && activeTab === 'progress' && <ProgressCharts userId={Number(id)} />}
        {isClient && activeTab === 'meals' && <MealList refresh={false} userId={Number(id)} />}
      </Content>
    </Container>
  );
};

export default ClientProfile;