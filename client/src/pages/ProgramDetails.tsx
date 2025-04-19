/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import ScrollReveal from '../components/ScrollReveal';
import Pagination from '../components/Pagination';

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
          <Title>Загрузка...</Title>
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
        </ButtonGroup>
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