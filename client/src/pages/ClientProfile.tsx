import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';
import WorkoutList from '../components/WorkoutList';
import MealList from '../components/MealList';
import ProgressCharts from './Progress';
import ScrollReveal from '../components/ScrollReveal';
import AssignWorkoutModal from '../components/AssignWorkoutModal';
import TrainerRequestModal from '../components/TrainerRequestModal';

interface AvatarProps {
  src: string;
}

// const Container = styled.div`
//   padding: 20px;
// `;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

// const Tabs = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 15px;
//   margin-bottom: 30px;

//   @media (max-width: 565px) {
//     flex-direction: column;
//     align-items: center;
//   }
// `;

// const Tab = styled.button<{ active: boolean }>`
//   padding: 12px 20px;
//   background-color: ${props => props.active ? '#058E3A' : '#f0f0f0'};
//   color: ${props => props.active ? 'white' : '#333'};
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   width: 100%;
//   font-weight: ${props => props.active ? '600' : 'normal'};
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     background-color: ${props => props.active ? '#046b2d' : '#e0e0e0'};
//   }

//   @media (max-width: 610px){
//     font-size: 0.9rem;
//   }
// `;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e9ff;
  overflow-x: auto; /* Добавляем горизонтальную прокрутку */
  scrollbar-width: none; /* Убираем стандартный скроллбар в Firefox */
  -ms-overflow-style: none; /* Убираем стандартный скроллбар в IE/Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Убираем стандартный скроллбар в WebKit */
  }
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1 1 auto; /* Позволяет табам занимать равное место */
  padding: 12px 24px;
  background-color: transparent;
  border: none;
  border-bottom: ${props => (props.active ? '3px solid #058E3A' : 'none')};
  cursor: pointer;
  font-weight: ${props => (props.active ? '600' : 'normal')};
  color: ${props => (props.active ? '#05396B' : '#666')};
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap; /* Предотвращает перенос текста в табах */

  &:hover {
    color: #05396B;
  }

  @media (max-width: 525px) {
    font-size: 0.9rem;
    padding: 10px 16px;
  }

  @media (max-width: 430px) {
    font-size: 0.8rem;
    padding: 10px 10px;
  }

  @media (max-width: 350px) {
    font-size: 0.75rem;
    padding: 5px 5px;
  }
`;

const Content = styled.div`
  margin-top: 20px;
`;

// const AddButton = styled.button`
//   padding: 8px 16px;
//   background-color: #28a745;
//   color: #fff;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;

//   &:hover {
//     background-color: #218838;
//   }
// `;

// const RemoveButton = styled.button`
//   padding: 8px 16px;
//   background-color: #dc3545;
//   color: #fff;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;

//   &:hover {
//     background-color: #c82333;
//   }
// `;

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

const Avatar = styled.div<AvatarProps>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${(props) => (props.src ? 'transparent' : '#e0e0e0')};
  background-image: ${(props) => (props.src ? `url(${props.src})` : 'none')};
  background-size: cover;
  background-position: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 500px){
    width: 80px;
    height: 80px;
  }

  @media (max-width: 400px){
    width: 75px;
    height: 75px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  margin-left: 15px;
  color: #05396B;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  margin-bottom: 10px;
  gap: 5px;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 500px){
    font-size: 1.5rem;
    margin-left: 10px;
  }

  @media (max-width: 400px){
    font-size: 1.3rem;
  }

  @media (max-width: 375px){
    line-height: 1;
  }
`;

const ProfileRole = styled.span`
  display: inline-block;
  background-color: #058E3A;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-left: 5px;
  @media (max-width: 500px){
    font-size: 0.8rem;
    margin-left: 0;
  }
  @media (max-width: 400px){
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
  @media (max-width: 375px){
    margin-top: 10px;
    padding: 0.3rem 0.7rem;
  }
`;

const ProfileSection = styled.section`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-direction: column;
`;

const Field = styled.div`
  margin-bottom: 0.2rem;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem; // Увеличили отступ
  margin-bottom: 1rem;
  width: 100%;
  @media (max-width: 500px){
    gap: 0.7rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #05396B;
`;

const Value = styled.div`
  padding: 0.8rem;
  background-color: #F5F5F5;
  border-radius: 8px;
  color: #333;
  min-height: 44px;
  display: flex;
  align-items: center;
  @media (max-width: 500px){
    min-height: 35px;
    padding: 0.6rem;
  }
`;

const RemoveButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#A80003' : '#A80003'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.type === 'button' ? '#930204' : '#930204'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 500px){
    font-size: 0.8rem;
  }
`;

const AddButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#058E3A' : '#058E3A'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.type === 'button' ? '#016728' : '#016728'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 500px){
    font-size: 0.8rem;
  }
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
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 15px;
  
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

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'workouts' | 'progress' | 'meals'>('profile');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [client, setClient] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // const fetchClientData = async () => {
  //   try {
  //     const [clientResponse, requestsResponse] = await Promise.all([
  //       api.get(`/profile/${id}`),
  //       api.get('/trainer-requests/trainer')
  //     ]);

  //     setClient(clientResponse.data);
  //     setIsClient(clientResponse.data.isClient);
      
  //     // Проверяем, есть ли pending запрос для этого клиента
  //     const pendingRequest = requestsResponse.data.find(
  //       (req: any) => req.client_id === Number(id) && req.status === 'pending'
  //     );
  //     setHasPendingRequest(!!pendingRequest);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchClientData = async () => {
    try {
      const [clientResponse, requestsResponse, myClientsResponse] = await Promise.all([
        api.get(`/profile/${id}`),
        api.get('/trainer-requests/trainer'),
        api.get('/profile/my-clients')
      ]);
  
      const clientData = clientResponse.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isMyClient = myClientsResponse.data.some((c: any) => c.id === Number(id));
      
      setClient({
        ...clientData,
        currentTrainerId: clientResponse.headers['x-current-user-id'] // Добавляем ID текущего пользователя
      });
      setIsClient(isMyClient);
      
      // Проверяем, есть ли pending запрос для этого клиента
      const pendingRequest = requestsResponse.data.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req: any) => req.client_id === Number(id) && req.status === 'pending'
      );
      setHasPendingRequest(!!pendingRequest);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClick = () => {
    setIsRequestModalOpen(true);
  };

  const handleSendRequest = async () => {
    try {
      await api.post('/trainer-requests/send', { clientId: Number(id) });
      setHasPendingRequest(true);
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveClick = () => {
    setIsRemoveModalOpen(true);
  };

  const confirmRemoveClient = async () => {
    try {
      await api.post('/profile/remove-client', { clientId: Number(id) });
      setIsClient(false);
      setIsRemoveModalOpen(false);
      // Обновляем данные клиента
      await fetchClientData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id, refresh]);

  if (!client) {
    return <Container>Loading...</Container>;
  }

  const renderActionButton = () => {
    // Если клиент уже имеет тренера (и это не текущий пользователь)
    if (client.trainer_id && client.trainer_id !== client.currentTrainerId) {
      return null; // Не показываем кнопку вообще
    }
  
    // Если клиент уже в списке текущего тренера
    if (isClient) {
      return (
        <ActionButton 
          variant="remove" 
          onClick={handleRemoveClick}
        >
          Удалить из клиентов
        </ActionButton>
      );
    }
  
    // Если клиент без тренера и нет pending запроса
    return (
      <ActionButton 
        variant="add" 
        onClick={handleAddClick}
        disabled={hasPendingRequest}
      >
        {hasPendingRequest ? 'Запрос отправлен' : 'Добавить клиента'}
      </ActionButton>
    );
  };

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



  // useEffect(() => {
  //   fetchClient();
  //   console.log(client)
  // }, [id]);

  if (!client) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <ScrollReveal delay={0.05}><Title>{client.fullname || client.username}</Title></ScrollReveal>
      <ScrollReveal delay={0.15}>
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
      </ScrollReveal>
      <Content>
        {activeTab === 'profile' && (
          <div>
            {/* <img src={client.avatar || 'http://localhost:5000/uploads/default.png'} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} /> */}
            {/* <Avatar src={client.avatar || 'http://localhost:5000/uploads/default.png'}/> */}
            <ScrollReveal delay={0.2}>
              <ProfileSection>
                {/* <Avatar src={client.avatar || 'http://localhost:5000/uploads/default.png'}/> */}
                <ProfileInfo>
                  <Avatar src={client.avatar || 'http://localhost:5000/uploads/default.png'}/>
                  <ProfileTitle>
                    {/* {client.fullname || '@' + client.username} */}
                    {'@' + client.username}
                    <ProfileRole style={{marginBottom: '0'}}>
                      {client.role === 'client' ? 'Клиент' : 'Тренер'}
                    </ProfileRole>
                  </ProfileTitle>
                </ProfileInfo>
                <FieldRow>
                  <Field>
                    <Label>Имя пользователя</Label>
                    <Value>{client.username}</Value>
                  </Field>
                  <Field>
                    <Label>Email</Label>
                    <Value>{client.email}</Value>
                  </Field>
                  <Field>
                    <Label>Номер телефона</Label>
                    <Value>{client.phone_number || 'Не указан'}</Value>
                  </Field>
                </FieldRow>
                {/* {client.isClient ? (
                <RemoveButton onClick={() => handleRemoveClient(client.id)}>Удалить из моих клиентов</RemoveButton>
                ) : (
                    <AddButton onClick={() => handleAddClient(client.id)}>Добавить клиента</AddButton>
                )} */}
                {renderActionButton()}
              </ProfileSection>
            </ScrollReveal>
          </div>
        )}

        {isClient && activeTab === 'workouts' && (
          <>
            <AddButton 
              onClick={() => setIsAssignModalOpen(true)}
              style={{ marginBottom: '20px' }}
            >
              Назначить тренировку
            </AddButton>
            <WorkoutList refresh={false} clientId={Number(id)} />
            {isAssignModalOpen && (
              <AssignWorkoutModal
                clientId={Number(id)}
                onClose={() => setIsAssignModalOpen(false)}
                onWorkoutAssigned={() => setRefresh(!refresh)}
              />
            )}
          </>
        )}
        {/* {isClient && activeTab === 'workouts' && <WorkoutList refresh={false} clientId={Number(id)} />} */}
        {isClient && activeTab === 'progress' && <ProgressCharts userId={Number(id)}/>}
        {isClient && activeTab === 'meals' && <MealList refresh={false} userId={Number(id)} />}
      </Content>


      <TrainerRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onConfirm={handleSendRequest}
        username={client.username}
      />

      <DeleteModalOverlay $isOpen={isRemoveModalOpen}>
        <DeleteModalContent>
          <DeleteModalClose onClick={() => setIsRemoveModalOpen(false)}>×</DeleteModalClose>
          <DeleteModalTitle>Подтверждение удаления</DeleteModalTitle>
          <DeleteModalText>
            Вы действительно хотите удалить клиента {client.username} из своего списка?
          </DeleteModalText>
          <DeleteModalActions>
            <DeleteButton className="secondary" onClick={() => setIsRemoveModalOpen(false)}>
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

export default ClientProfile;