/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: string }>`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${(props) => (props.active === 'true' ? '#007bff' : '#f9f9f9')};
  color: ${(props) => (props.active === 'true' ? '#fff' : '#333')};
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active === 'true' ? '#0056b3' : '#eee')};
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
`;

const ClientCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const ClientUsername = styled.p`
  margin: 0;
  color: #555;
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

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [myClients, setMyClients] = useState<Set<number>>(new Set()); // Храним ID клиентов тренера
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-clients' | 'find-client'>('my-clients');
  const [myClientsSearch, setMyClientsSearch] = useState('');


  useEffect(() => {
    const fetchClients = async () => {
      try {
        if (activeTab === 'my-clients') {
          // Загружаем только список клиентов тренера
          const response = await api.get('/profile/my-clients');
  
          // Добавляем флаг isClient: true для всех загруженных клиентов
          const updatedClients = response.data.map((client: any) => ({
            ...client,
            isClient: true, // Эти пользователи точно клиенты тренера
          }));
  
          setClients(updatedClients);
          setMyClients(new Set(response.data.map((client: any) => client.id))); // Сохраняем их ID
        } else {
          // Загружаем всех пользователей
          const allClientsResponse = await api.get('/profile/all-clients');
          const myClientsResponse = await api.get('/profile/my-clients');
  
          const myClientsSet = new Set(myClientsResponse.data.map((client: any) => client.id));
  
          // Отмечаем, какие клиенты уже принадлежат тренеру
          const updatedClients = allClientsResponse.data.map((client: any) => ({
            ...client,
            isClient: myClientsSet.has(client.id),
          }));
  
          setClients(updatedClients);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setMyClients(myClientsSet);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchClients();
  }, [activeTab]);
  

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      const response = await api.get(`/profile/search-clients?query=${query}`);
      const updatedClients = response.data.map((client: any) => ({
        ...client,
        isClient: myClients.has(client.id),
      }));
      setClients(updatedClients);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClient = async (clientId: number) => {
    try {
      await api.post('/profile/add-client', { clientId });
      setMyClients((prev) => new Set(prev).add(clientId));
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? { ...client, isClient: true } : client
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveClient = async (clientId: number) => {
    try {
      await api.post('/profile/remove-client', { clientId });
  
      setClients((prevClients) => {
        if (activeTab === 'my-clients') {
          // Если мы в разделе "Список моих клиентов" — убираем пользователя из списка
          return prevClients.filter((client) => client.id !== clientId);
        } else {
          // Если в разделе "Найти клиента" — просто меняем кнопку
          return prevClients.map((client) =>
            client.id === clientId ? { ...client, isClient: false } : client
          );
        }
      });
  
      setMyClients((prev) => {
        const updatedClients = new Set(prev);
        updatedClients.delete(clientId); // Удаляем из множества клиентов тренера
        return updatedClients;
      });
  
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const filteredClients = clients.filter(client =>
    client.username.toLowerCase().includes(myClientsSearch.toLowerCase())
  );
  
  

  return (
    <Container>
      <h1>My Clients</h1>
      <Tabs>
        <Tab active={activeTab === 'my-clients' ? 'true' : 'false'} onClick={() => setActiveTab('my-clients')}>
          Список моих клиентов
        </Tab>
        <Tab active={activeTab === 'find-client' ? 'true' : 'false'} onClick={() => setActiveTab('find-client')}>
          Найти клиента
        </Tab>
      </Tabs>
      {activeTab === 'find-client' && (
        <SearchInput
          type="text"
          placeholder="Найти клиента..."
          value={searchQuery}
          onChange={handleSearch}
        />
      )}
      {activeTab === 'my-clients' && (
        <SearchInput
            type="text"
            placeholder="Поиск среди моих клиентов..."
            value={myClientsSearch}
            onChange={(e) => setMyClientsSearch(e.target.value)}
        />
        )}
      {filteredClients.map((client) => (
        <ClientCard key={client.id}>
            <Link to={`/profile/${client.id}`} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar src={client.avatar || 'http://localhost:5000/uploads/default.png'} alt="Avatar" />
            <ClientInfo>
                <ClientName>{client.fullname || client.username}</ClientName>
                <ClientUsername>@{client.username}</ClientUsername>
            </ClientInfo>
            </Link>
            {client.isClient ? (
            <RemoveButton onClick={() => handleRemoveClient(client.id)}>Remove from my clients</RemoveButton>
            ) : (
                <AddButton onClick={() => handleAddClient(client.id)}>Add Client</AddButton>
            )}
        </ClientCard>
        ))}
    </Container>
  );
};

export default ClientsList;
