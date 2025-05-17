/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #05396B;
  font-size: 2rem;
  margin-bottom: 20px;

  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 500px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.4rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e9ff;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background-color: transparent;
  border: none;
  border-bottom: ${props => props.active ? '3px solid #058E3A' : 'none'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  color: ${props => props.active ? '#05396B' : '#666'};
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 50%;
  
  &:hover {
    color: #05396B;
  }

  @media (max-width: 375px){
    font-size: 0.9rem;
  }

  @media (max-width: 340px){
    font-size: 0.8rem;
  }
`;

const SearchInput = styled.input`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }
  
  &::placeholder {
    color: #999;
  }

  @media (max-width: 400px){
    font-size: 0.9rem;
  }
`;

const ClientCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  @media (max-width: 550px){
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const ClientLink = styled(Link)`
  display: flex;
  align-items: center;
  flex: 1;
  text-decoration: none;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.h3`
  margin: 0;
  color: #05396B;
  font-size: 1.2rem;
`;

const ClientUsername = styled.p`
  margin: 5px 0 5px 0;
  color: #666;
  font-size: 0.9rem;
`;

const ActionButton = styled.button<{ variant: 'add' | 'remove' }>`
  padding: 10px 20px;
  background-color: ${props => props.variant === 'add' ? '#058E3A' : '#A80003'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:hover {
    background-color: ${props => props.variant === 'add' ? '#046b2d' : '#8a0002'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 550px) {
    min-width: 120px;
    padding: 8px 12px;
    font-size: 0.8rem;
    margin-top: 20px;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 1.1rem;
`;

const ClientCount = styled.div`
  font-size: 1rem;
  color: #05396B;
  margin-bottom: 15px;
  font-weight: 500;

  @media (max-width: 400px) {
    font-size: 0.9rem;
  }
`;

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [myClients, setMyClients] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-clients' | 'find-client'>('my-clients');
  const [myClientsSearch, setMyClientsSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        if (activeTab === 'my-clients') {
          const response = await api.get('/profile/my-clients');
          const updatedClients = response.data.map((client: any) => ({
            ...client,
            isClient: true,
          }));
          setClients(updatedClients);
          setMyClients(new Set(response.data.map((client: any) => client.id)));
        } else {
          const [allClientsResponse, myClientsResponse] = await Promise.all([
            api.get('/profile/all-clients'),
            api.get('/profile/my-clients')
          ]);

          const myClientsSet = new Set(myClientsResponse.data.map((client: any) => client.id));
          const updatedClients = allClientsResponse.data.map((client: any) => ({
            ...client,
            isClient: myClientsSet.has(client.id),
          }));

          setClients(updatedClients);
          setMyClients(myClientsSet);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    setMyClientsSearch('')
    setSearchQuery('')
  }, [activeTab]);
  

  // const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   try {
  //     const response = await api.get(`/profile/search-clients?query=${query}`);
  //     const updatedClients = response.data.map((client: any) => ({
  //       ...client,
  //       isClient: myClients.has(client.id),
  //     }));
  //     setClients(updatedClients);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      const response = await api.get(`/profile/search-clients?query=${query}`);
      const updatedClients = response.data.map((client: any) => ({
        ...client,
        isClient: myClients.has(client.id),
        fullname: client.fullname || '', // Убедиться, что fullname всегда существует
        username: client.username || '', // Убедиться, что username всегда существует
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
          return prevClients.filter((client) => client.id !== clientId);
        } else {
          return prevClients.map((client) =>
            client.id === clientId ? { ...client, isClient: false } : client
          );
        }
      });
  
      setMyClients((prev) => {
        const updatedClients = new Set(prev);
        updatedClients.delete(clientId);
        return updatedClients;
      });
    } catch (error) {
      console.error(error);
    }
  };

  // const filteredClients = clients.filter(client =>
  //   client.username.toLowerCase().includes(
  //     (activeTab === 'my-clients' ? myClientsSearch : searchQuery).toLowerCase()
  //   )
  // );

  const filteredClients = clients.filter(client => {
    const searchValue = (activeTab === 'my-clients' ? myClientsSearch : searchQuery).toLowerCase();
    return (
      (client.username && client.username.toLowerCase().includes(searchValue)) ||
      (client.fullname && client.fullname.toLowerCase().includes(searchValue))
    );
  });

  return (
    <Container>
      <ScrollReveal>
        <Title>Мои клиенты</Title>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Tabs>
          <Tab 
            active={activeTab === 'my-clients'} 
            onClick={() => setActiveTab('my-clients')}
          >
            Мои клиенты
          </Tab>
          <Tab 
            active={activeTab === 'find-client'} 
            onClick={() => setActiveTab('find-client')}
          >
            Найти клиента
          </Tab>
        </Tabs>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
  {(activeTab === 'my-clients' ? myClientsSearch : searchQuery).trim() !== '' && (
    <ClientCount style={{ marginBottom: '30px', fontSize: '1.2rem', fontWeight: '400', color: '#058E3A', textAlign: 'center' }}>
      Найдено <b>{filteredClients.length}</b> {filteredClients.length === 1 ? 'клиент' : filteredClients.length < 5 ? 'клиента' : 'клиентов'}
    </ClientCount>
  )}
  <SearchInput
    type="text"
    placeholder={activeTab === 'my-clients' 
      ? "Поиск среди моих клиентов..." 
      : "Найти клиента по имени или логину..."}
    value={activeTab === 'my-clients' ? myClientsSearch : searchQuery}
    onChange={activeTab === 'my-clients' 
      ? (e) => setMyClientsSearch(e.target.value)
      : handleSearch}
  />
</ScrollReveal>

      {loading ? (
        <EmptyMessage>Загрузка...</EmptyMessage>
      ) : filteredClients.length === 0 ? (
        <EmptyMessage>
          {activeTab === 'my-clients' && searchQuery.length !== 0
            ? "У вас пока нет клиентов" 
            : "Клиенты не найдены"}
        </EmptyMessage>
      ) : (
        filteredClients.map((client, index) => (
          <ScrollReveal key={client.id} delay={0.3 + index * 0.05}>
            {/* <ClientCard>
              <ClientLink to={`/profile/${client.id}`}>
                <Avatar 
                  src={client.avatar || 'http://localhost:5000/uploads/default.png'} 
                  alt={client.fullname || client.username} 
                />
                <ClientInfo>
                  <ClientName>{client.fullname || '@' + client.username}</ClientName>
                  <ClientUsername>@{client.username}</ClientUsername>
                </ClientInfo>
              </ClientLink>
              {client.isClient ? (
                <ActionButton 
                  variant="remove" 
                  onClick={() => handleRemoveClient(client.id)}
                >
                  Удалить из клиентов
                </ActionButton>
              ) : (
                <ActionButton 
                  variant="add" 
                  onClick={() => handleAddClient(client.id)}
                >
                  Добавить клиента
                </ActionButton>
              )}
            </ClientCard> */}
            <ClientCard>
            <ClientLink to={`/profile/${client.id}`}>
              <Avatar 
                src={client.avatar || 'http://localhost:5000/uploads/default.png'} 
                alt={client.fullname || client.username || 'Неизвестный клиент'} 
              />
              <ClientInfo>
                <ClientName>{client.fullname || '@' + client.username || 'Неизвестный клиент'}</ClientName>
                <ClientUsername>{client.username ? '@' + client.username : ''}</ClientUsername>
              </ClientInfo>
            </ClientLink>
            {client.isClient ? (
              <ActionButton 
                variant="remove" 
                onClick={() => handleRemoveClient(client.id)}
              >
                Удалить из клиентов
              </ActionButton>
            ) : (
              <ActionButton 
                variant="add" 
                onClick={() => handleAddClient(client.id)}
              >
                Добавить клиента
              </ActionButton>
            )}
          </ClientCard>
          </ScrollReveal>
        ))
      )}
    </Container>
  );
};

export default ClientsList;