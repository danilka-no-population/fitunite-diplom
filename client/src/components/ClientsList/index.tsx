/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import TrainerRequestModal from '../TrainerRequestModal';

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

const ActionButton = styled.button<{ variant: 'add' | 'remove' | 'disabled' | 'pending' }>`
  padding: 10px 20px;
  background-color: ${props => 
    props.variant === 'add' ? '#058E3A' : 
    props.variant === 'remove' ? '#A80003' :
    props.variant === 'pending' ? '#666' : '#ccc'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:hover {
    background-color: ${props => 
      props.disabled ? '' : 
      props.variant === 'add' ? '#046b2d' : 
      props.variant === 'remove' ? '#8a0002' : '#666'};
    transform: ${props => props.disabled ? '' : 'translateY(-2px)'};
  }
  
  &:active {
    transform: ${props => props.disabled ? '' : 'translateY(0)'};
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

const DeleteModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DeleteModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const DeleteModalClose = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  line-height: 1;

  &:hover {
    color: #333;
  }
`;

const DeleteModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #05396B;
`;

const DeleteModalText = styled.p`
  margin-bottom: 2rem;
  color: #333;
  line-height: 1.5;
`;

const DeleteModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const DeleteButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;

  &.secondary {
    background-color: #F5F5F5;
    color: #333;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &.danger {
    background-color: #A80003;
    color: white;

    &:hover {
      background-color: #8a0002;
    }
  }
`;

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [myClients, setMyClients] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-clients' | 'find-client'>('my-clients');
  const [myClientsSearch, setMyClientsSearch] = useState('');
  const [loading, setLoading] = useState(true);



  // Добавляем новые состояния
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());

  // Добавляем обработчик для кнопки добавления клиента
  const handleAddClick = (client: any) => {
    if (client.trainer_id) {
      return; // У клиента уже есть тренер
    }
    setSelectedClient(client);
    setIsRequestModalOpen(true);
  };

  useEffect(() => {
    // Обновляем функцию fetchClients
    const fetchClients = async () => {
      setLoading(true);
      try {
          if (activeTab === 'my-clients') {
              const response = await api.get('/profile/my-clients');
              const updatedClients = response.data.map((client: any) => ({
                  ...client,
                  isClient: true,
                  hasPendingRequest: false,
                  trainer_id: response.data.trainer_id // Добавляем trainer_id
              }));
              setClients(updatedClients);
              setMyClients(new Set(response.data.map((client: any) => client.id)));
          } else {
              const [allClientsResponse, myClientsResponse, requestsResponse] = await Promise.all([
                  api.get('/profile/all-clients'),
                  api.get('/profile/my-clients'),
                  api.get('/trainer-requests/trainer')
              ]);
  
              const myClientsSet = new Set(myClientsResponse.data.map((client: any) => client.id));
              const sentRequestsSet = new Set(
                  requestsResponse.data
                      .filter((req: any) => req.status === 'pending')
                      .map((req: any) => req.client_id)
              );
  
              const updatedClients = allClientsResponse.data.map((client: any) => ({
                  ...client,
                  isClient: myClientsSet.has(client.id),
                  hasPendingRequest: sentRequestsSet.has(client.id),
                  trainer_id: client.trainer_id || null // Явно указываем trainer_id
              }));
  
              setClients(updatedClients);
              setMyClients(myClientsSet);
              setSentRequests(sentRequestsSet);
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



          // Обновляем функцию fetchClients
          const fetchClients = async () => {
            setLoading(true);
            try {
                if (activeTab === 'my-clients') {
                    const response = await api.get('/profile/my-clients');
                    const updatedClients = response.data.map((client: any) => ({
                        ...client,
                        isClient: true,
                        hasPendingRequest: false,
                        trainer_id: response.data.trainer_id // Добавляем trainer_id
                    }));
                    setClients(updatedClients);
                    setMyClients(new Set(response.data.map((client: any) => client.id)));
                } else {
                    const [allClientsResponse, myClientsResponse, requestsResponse] = await Promise.all([
                        api.get('/profile/all-clients'),
                        api.get('/profile/my-clients'),
                        api.get('/trainer-requests/trainer')
                    ]);
        
                    const myClientsSet = new Set(myClientsResponse.data.map((client: any) => client.id));
                    const sentRequestsSet = new Set(
                        requestsResponse.data
                            .filter((req: any) => req.status === 'pending')
                            .map((req: any) => req.client_id)
                    );
        
                    const updatedClients = allClientsResponse.data.map((client: any) => ({
                        ...client,
                        isClient: myClientsSet.has(client.id),
                        hasPendingRequest: sentRequestsSet.has(client.id),
                        trainer_id: client.trainer_id || null // Явно указываем trainer_id
                    }));
        
                    setClients(updatedClients);
                    setMyClients(myClientsSet);
                    setSentRequests(sentRequestsSet);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

    fetchClients();


    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClient = async (clientId: number) => {
    try {
      await api.post('/trainer-requests/send', { clientId });
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? { ...client, hasPendingRequest: true } : client
        )
      );
      setSentRequests((prev) => new Set(prev).add(clientId));
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleRemoveClick = (client: any) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };
  
  // const confirmRemoveClient = async () => {
  //   if (!clientToDelete) return;
    
  //   try {
  //     await api.post('/profile/remove-client', { clientId: clientToDelete.id });
      
  //     setClients(prevClients => 
  //       prevClients.map(client => 
  //         client.id === clientToDelete.id 
  //           ? { ...client, isClient: false, hasPendingRequest: false } 
  //           : client
  //       )
  //     );
      
  //     setMyClients(prev => {
  //       const updated = new Set(prev);
  //       updated.delete(clientToDelete.id);
  //       return updated;
  //     });
      
  //     setIsDeleteModalOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const confirmRemoveClient = async () => {
    if (!clientToDelete) return;
    
    try {
      await api.post('/profile/remove-client', { clientId: clientToDelete.id });
      
      // Для всех случаев обновляем состояние клиента
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientToDelete.id 
            ? { 
                ...client, 
                isClient: false, 
                hasPendingRequest: false,
                trainer_id: null // Явно сбрасываем trainer_id
              } 
            : client
        )
      );
      
      setMyClients(prev => {
        const updated = new Set(prev);
        updated.delete(clientToDelete.id);
        return updated;
      });
      
      setIsDeleteModalOpen(false);
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
            {/* {client.isClient ? (
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
            )} */}
            {client.isClient ? (
                <ActionButton 
                    variant="remove" 
                    onClick={() => handleRemoveClick(client)}
                >
                    Удалить из клиентов
                </ActionButton>
            ) : (
                <ActionButton 
                    variant={client.trainer_id ? 'disabled' : client.hasPendingRequest ? 'pending' : 'add'} 
                    onClick={() => client.trainer_id ? null : handleAddClick(client)}
                    disabled={!!client.trainer_id || client.hasPendingRequest}
                >
                    {client.trainer_id 
                        ? 'Есть тренер' 
                        : client.hasPendingRequest 
                            ? 'Запрос отправлен' 
                            : 'Добавить клиента'}
                </ActionButton>
            )}
          </ClientCard>
          </ScrollReveal>
        ))
      )}



      <TrainerRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onConfirm={() => {
          handleAddClient(selectedClient.id);
          setIsRequestModalOpen(false);
        }}
        username={selectedClient?.username}
      />
      <DeleteModalOverlay $isOpen={isDeleteModalOpen}>
        <DeleteModalContent>
          <DeleteModalClose onClick={() => setIsDeleteModalOpen(false)}>×</DeleteModalClose>
          <DeleteModalTitle>Подтверждение удаления</DeleteModalTitle>
          <DeleteModalText>
            Вы действительно хотите удалить клиента {clientToDelete?.username} из своего списка?
          </DeleteModalText>
          <DeleteModalActions>
            <DeleteButton className="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Отмена
            </DeleteButton>
            <DeleteButton className="danger" onClick={confirmRemoveClient}>
              Удалить
            </DeleteButton>
          </DeleteModalActions>
        </DeleteModalContent>
      </DeleteModalOverlay>
    </Container>
  );
};

export default ClientsList;