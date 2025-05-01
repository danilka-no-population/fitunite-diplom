/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ScrollReveal from '../components/ScrollReveal';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 90vh;
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

  @media (max-width: 400px) {
    font-size: 1.2rem;
  }
`;

const ProgramInfo = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 30px;
`;

const InfoRow = styled.p`
  color: #058E3A;
  margin-bottom: 10px;
  font-size: 1rem;
  line-height: 1.5;

  strong {
    color: #058E3A;
    font-weight: 700;
  }
`;

const Description = styled.div`
  color: #05396B;
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f9ff;
  border-radius: 10px;
  border: 1px solid #e0e9ff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.color === 'danger' ? '#A80003' : props.color === 'secondary' ? '#5CDB94' : '#007bff'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.color === 'danger' ? '#930204' : props.color === 'secondary' ? '#4BCB84' : '#0056b3'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 500px) {
    padding: 10px 15px;
    font-size: 0.8rem;
  }
`;

const WorkoutCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const WorkoutTitle = styled.h3`
  color: #05396B;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const WorkoutMeta = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

// const ModalContent = styled.div`
//   padding: 30px;
//   background: white;
//   border-radius: 20px;
//   max-width: 600px;
//   margin: 0 auto;
//   position: relative;
//   max-height: 90vh;
// `;

const ModalContent = styled.div`
  padding: 30px;
  background: white;
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  max-height: 85vh; /* Ограничиваем высоту */
  overflow-y: auto; /* Добавляем вертикальный скролл при необходимости */
  z-index: 1001;
`;

const ModalInnerContent = styled.div`
  /* Этот контейнер для основного содержимого модалки */
  padding-right: 15px; /* Оставляем место для скролла */
`;

const ModalTitle = styled.h2`
  color: #05396B;
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-right: 30px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #A80003;
  }
`;

const ExerciseCard = styled.div`
  margin: 15px 0;
  padding: 15px;
  background-color: #f5f9ff;
  border: 1px solid #e0e9ff;
  border-radius: 10px;
`;

const ExerciseTitle = styled.h3`
  color: #05396B;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const ExerciseDetail = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
  
  b {
    color: #05396B;
  }
`;

const CommentsSection = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-top: 30px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #05396B;
  margin-bottom: 15px;
  min-height: 100px;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }
`;

const CommentCard = styled.div`
  padding: 15px;
  margin: 15px 0;
  background-color: #f0f7ff;
  border-radius: 10px;
  border: 1px solid #d0e3ff;
`;

const CommentText = styled.p`
  color: #05396B;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0px;

  @media (max-width: 400px){
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    button {
      width: 100%;
      margin-bottom: 10px;
    }
  }
`;

const CommentAuthor = styled.p`
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 5px;
  font-style: italic;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
`;

interface ModalProps {
  $isOpen: boolean;
}

const ModalOverlay = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1001;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 0;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;

  &:hover {
    color: #333;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SearchInput = styled.input`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #05396B;
  flex: 2;
  min-width: 180px;
  width: 100%;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px){
    font-size: 0.9rem;
    padding: 10px;
  }
`;

const AssignModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideUp 0.3s ease;

  @media (max-width: 500px) {
    width: 95%;
    padding: 1rem;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ClientsList = styled.div`
  flex: 1;
  min-height: 100px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ClientItem = styled.div<{ $isSelected: boolean }>`
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background-color: ${props => props.$isSelected ? '#f0f7ff' : 'white'};
  border: 1px solid #e0e9ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$isSelected ? '#e0f0ff' : '#f9f9f9'};
  }

  @media (max-width: 500px) {
    padding: 0.5rem 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const ClientName = styled.div`
  font-weight: 600;
  color: #05396B;
`;

const ClientUsername = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

Modal.setAppElement('#root');

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentWorkoutPage, setCurrentWorkoutPage] = useState(1);
  const [currentExercisePage, setCurrentExercisePage] = useState(1);
  const workoutsPerPage = 5;
  const exercisesPerPage = 5;

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [assignError, setAssignError] = useState('');
  const [user, setUser] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 3;

  const filteredClients = clients.filter(client => 
    client.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.fullname && client.fullname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const fetchClients = async () => {
    try {
      const response = await api.get('/profile/my-clients');
      setClients(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openAssignModal = async () => {
    if (user?.role === 'trainer') {
      await fetchClients();
      setIsAssignModalOpen(true);
      setSelectedClient(null);
      setAssignError('');
    }
  };

  const assignProgram = async () => {
    if (!selectedClient) return;
    
    try {
      await api.post('/assigned-programs/assign', {
        program_id: id,
        client_id: selectedClient.id
      });
      setIsAssignModalOpen(false);
      // Можно добавить уведомление об успешном назначении
    } catch (error: any) {
      console.error(error);
      setAssignError(error.response?.data?.message || 'Ошибка при назначении программы');
    }
  };

  useEffect(() => {
    if (assignError) {
      const timer = setTimeout(() => {
        setAssignError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [assignError]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await api.get(`/programs/${id}`);
        setProgram(response.data);

        const likedResponse = await api.get(`/programs/likes/${id}/is-liked`);
        setIsLiked(likedResponse.data.isLiked);

        const favoriteResponse = await api.get(`/favorites/${id}/is-favorite`);
        setIsFavorite(favoriteResponse.data.isFavorite);

        const commentsResponse = await api.get(`/programs/comments/${id}/comments`);
        setComments(commentsResponse.data);

        const likesCountResponse = await api.get(`/programs/likes/${id}/count`);
        setLikesCount(likesCountResponse.data.likesCount);

        const responseMe = await api.get('/profile');
        setUser(responseMe.data);

        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(decodedToken.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProgram();
  }, [id]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.post('/programs/likes/unlike', { program_id: id });
        setLikesCount(likesCount - 1);
      } else {
        await api.post('/programs/likes/like', { program_id: id });
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.post('/favorites/remove', { program_id: id });
      } else {
        await api.post('/favorites/add', { program_id: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;
    
    try {
      const response = await api.post('/programs/comments/comment', {
        program_id: id,
        comment: trimmedComment,
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (comment_id: number) => {
    try {
      await api.delete(`/programs/comments/comment/${comment_id}`);
      setComments(comments.filter((comment) => comment.id !== comment_id));
    } catch (error) {
      console.error(error);
    }
  };

  const openWorkoutModal = async (workoutId: number) => {
    try {
      const response = await api.get(`/workouts/${workoutId}/exercises`);
      setSelectedWorkout({
        ...program.workouts.find((w: any) => w.id === workoutId),
        exercises: response.data
      });
      setModalIsOpen(true);
      setCurrentExercisePage(1);
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination for workouts
  const indexOfLastWorkout = currentWorkoutPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = program?.workouts?.slice(indexOfFirstWorkout, indexOfLastWorkout) || [];
  const workoutTotalPages = program?.workouts ? Math.ceil(program.workouts.length / workoutsPerPage) : 0;

  // Pagination for exercises in modal
  const indexOfLastExercise = currentExercisePage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = selectedWorkout?.exercises?.slice(indexOfFirstExercise, indexOfLastExercise) || [];
  const exerciseTotalPages = selectedWorkout?.exercises ? Math.ceil(selectedWorkout.exercises.length / exercisesPerPage) : 0;

  if (!program) {
    return (
      <Container>
        <ScrollReveal>
          <Loader/>
        </ScrollReveal>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollReveal>
        <Title>{program.name}</Title>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ProgramInfo>
          <InfoRow><strong>Тип:</strong> {program.type}</InfoRow>
          <InfoRow><strong>Продолжительность:</strong> {program.days_count} дней</InfoRow>
          <InfoRow><strong>Количество тренировок:</strong> {program.workouts_count}</InfoRow>
          <InfoRow><strong>Автор:</strong> {program.author_fullname || program.author_username}</InfoRow>
          <InfoRow><strong>Дата создания:</strong> {new Date(program.created_at).toLocaleDateString('ru-RU')}</InfoRow>
          <InfoRow><strong>Доступ:</strong> {program.is_public ? 'Общедоступная' : 'Приватная'}</InfoRow>
          
          {program.description && (
            <>
              <Divider />
              <Description>
                <strong>Описание:</strong> {program.description}
              </Description>
            </>
          )}
        </ProgramInfo>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
          <h2 style={{ color: '#05396B', marginBottom: '20px' }}>Тренировки в программе</h2>
          
          {currentWorkouts?.map((workout: any) => (
            <WorkoutCard key={workout.id} onClick={() => openWorkoutModal(workout.id)}>
              <WorkoutTitle>{workout.name || `Тренировка #${workout.id}`}</WorkoutTitle>
              <WorkoutMeta style={{color: '#058E3A'}}><strong style={{color: '#058E3A'}}>Тип:</strong> {workout.type}</WorkoutMeta>
              <WorkoutMeta style={{color: '#058E3A'}}><strong style={{color: '#058E3A'}}>Длительность:</strong> {workout.duration} минут</WorkoutMeta>
            </WorkoutCard>
          ))}

        {workoutTotalPages > 1 && (
          <Pagination
            currentPage={currentWorkoutPage}
            totalPages={workoutTotalPages}
            paginate={setCurrentWorkoutPage}
          />
        )}
      </ScrollReveal>

      <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel="Workout Details"
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'hidden'
      },
      content: {
        position: 'relative',
        inset: 'auto',
        border: 'none',
        background: 'none',
        overflow: 'hidden', // Изменено с 'visible' на 'hidden'
        width: '90%',
        maxWidth: '800px',
        padding: 0 // Убираем стандартные отступы модального окна
      }
    }}
  >
    <ModalContent>
      <ModalInnerContent>
        {selectedWorkout && (
          <>
            <CloseButton onClick={() => setModalIsOpen(false)}>×</CloseButton>
            <ModalTitle>{selectedWorkout.name || `Тренировка #${selectedWorkout.id}`}</ModalTitle>
            
            <InfoRow><strong>Тип:</strong> {selectedWorkout.type}</InfoRow>
            <InfoRow><strong>Длительность тренировки:</strong> {selectedWorkout.duration} мин.</InfoRow>
            
            {selectedWorkout.description && (
              <Description>
                <strong>Дополнительные инструкции:</strong> {selectedWorkout.description}
              </Description>
            )}

            <h3 style={{ color: '#05396B', margin: '20px 0 15px' }}>Упражнения:</h3>
            
            {currentExercises?.map((exercise: any) => (
              <ExerciseCard key={exercise.id}>
                <ExerciseTitle>{exercise.name}</ExerciseTitle>
                <ExerciseDetail style={{color: '#058E3A'}}><strong>Категория:</strong> {exercise.category}</ExerciseDetail>
                
                {exercise.type === 'cardio' ? (
                  <>
                    <ExerciseDetail style={{color: '#058E3A'}}><strong>Время бега:</strong> {exercise.duration} мин.</ExerciseDetail>
                    <ExerciseDetail style={{color: '#058E3A'}}><strong>Дистанция:</strong> {exercise.distance} км</ExerciseDetail>
                    <ExerciseDetail style={{color: '#058E3A'}}><strong>Средняя скорость:</strong> {(exercise.distance / (exercise.duration / 60)).toFixed(2)} км/ч</ExerciseDetail>
                  </>
                ) : (
                  <>
                    <ExerciseDetail style={{color: '#058E3A'}}><strong>Подходы:</strong> {exercise.sets}</ExerciseDetail>
                    <ExerciseDetail style={{color: '#058E3A'}}><strong>Повторения:</strong> {exercise.reps}</ExerciseDetail>
                    {exercise.weight > 0 && (
                      <ExerciseDetail style={{color: '#058E3A'}}><strong>Вес:</strong> {exercise.weight} кг</ExerciseDetail>
                    )}
                  </>
                )}
              </ExerciseCard>
            ))}

            {exerciseTotalPages > 1 && (
              <Pagination
                currentPage={currentExercisePage}
                totalPages={exerciseTotalPages}
                paginate={setCurrentExercisePage}
              />
            )}
          </>
        )}
      </ModalInnerContent>
    </ModalContent>
  </Modal>

      <ScrollReveal delay={0.2}>
        <ButtonGroup>
          <Button onClick={handleLike} style={{backgroundColor: !isLiked ? '#058E3A' : '#05396B'}}>
            {isLiked ? '❤️' : '🤍'} Нравится ({likesCount})
          </Button>
          <Button 
            color="secondary" 
            onClick={handleFavorite}
            style={{backgroundColor: isFavorite ? '#A80003' : '#058E3A'}}
          >
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </Button>
          {user?.role === 'trainer' && (
            <Button 
              color="primary" 
              onClick={openAssignModal}
              style={{backgroundColor: '#058E3A'}}
            >
              Назначить эту программу моему клиенту
            </Button>
          )}
        </ButtonGroup>
      </ScrollReveal>



      <ScrollReveal delay={0.1}>
        <ModalOverlay $isOpen={isAssignModalOpen} onClick={() => setIsAssignModalOpen(false)}>
          <AssignModalContent style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <ModalClose onClick={() => setIsAssignModalOpen(false)}>×</ModalClose>
            <ModalTitle></ModalTitle>
            
            <SearchInput
              type="text"
              placeholder="Поиск среди моих клиентов..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1);
              }}
              style={{ marginTop: '0.5rem' }}
            />

      <ClientsList>
      {currentClients.length > 0 ? (
        currentClients.map(client => (
          <ClientItem 
            key={client.id}
            $isSelected={selectedClient?.id === client.id}
            onClick={() => setSelectedClient(client)}
          >
            <ClientName>{client.fullname || `@${client.username}`}</ClientName>
            <ClientUsername>@{client.username}</ClientUsername>
          </ClientItem>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Клиенты не найдены
        </div>
      )}
    </ClientsList>

    {filteredClients.length > clientsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0', fontSize: '0.8rem', fontWeight: 'bold',  }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{ 
                padding: '0.2rem 1rem',
                margin: '0 0.5rem',
                border: 'none',
                background: currentPage === 1 ? '#f0f0f0' : '#05396B',
                color: currentPage === 1 ? '#999' : 'white',
                borderRadius: '5px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            >
              Назад
            </button>
            <span style={{ padding: '0.5rem' }}>
              {currentPage} из {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ 
                padding: '0.2rem 1rem',
                margin: '0 0.2rem',
                border: 'none',
                background: currentPage === totalPages ? '#f0f0f0' : '#05396B',
                color: currentPage === totalPages ? '#999' : 'white',
                borderRadius: '5px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            >
              Вперед
            </button>
          </div>
        )}
            
            {/* <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {clients
                .filter(client => 
                  client.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (client.fullname && client.fullname.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(client => (
                  <div 
                    key={client.id}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      backgroundColor: selectedClient?.id === client.id ? '#f0f7ff' : 'white',
                      border: '1px solid #e0e9ff',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div style={{ fontWeight: '600', color: '#05396B' }}>
                      {client.fullname || `@${client.username}`}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      @{client.username}
                    </div>
                  </div>
                ))}
            </div> */}
            
            {assignError && (
              <div style={{ color: '#A80003', padding: '10px', borderRadius: '8px', margin: '1.5rem 0 -1rem 0', textAlign: 'center', fontSize: '0.8rem', backgroundColor: '#A8000320' }}>
                {assignError}
              </div>
            )}
            
            <ModalActions>
              <Button 
                className="secondary" 
                onClick={() => setIsAssignModalOpen(false)} 
                style={{backgroundColor: '#A80003', width: '30%'}}
              >
                Отмена
              </Button>
              <Button 
                className="primary" 
                onClick={assignProgram}
                disabled={!selectedClient}
                style={{backgroundColor: '#058E3A', width: '70%'}}
              >
                Назначить программу
              </Button>
            </ModalActions>
          </AssignModalContent>
        </ModalOverlay>
      </ScrollReveal>




      <ScrollReveal delay={0.4}>
        <CommentsSection>
          <h2 style={{ color: '#05396B', marginBottom: '20px' }}>Комментарии</h2>
          
          <form onSubmit={handleCommentSubmit}>
            <CommentInput
              placeholder="Напишите ваш комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <Button type="submit" style={{backgroundColor: '#05396B', width: '100%'}}>Отправить</Button>
          </form>

          {comments.map((comment) => (
            <CommentCard key={comment.id}>
              <CommentText>{comment.comment}
              {currentUserId === comment.user_id && (
                <Button 
                  color="danger" 
                  onClick={() => handleDeleteComment(comment.id)}
                  style={{ marginTop: '10px'}}
                >
                  Удалить
                </Button>
              )}
              </CommentText>
              <CommentAuthor>@{comment.username}, {new Date(comment.created_at).toLocaleDateString('ru-RU')}</CommentAuthor>
            </CommentCard>
          ))}
        </CommentsSection>
      </ScrollReveal>
    </Container>
  );
};

export default ProgramDetail;