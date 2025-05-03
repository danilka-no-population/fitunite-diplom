/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import AddWorkoutComment from '../AddWorkoutComment';
import { jwtDecode } from 'jwt-decode';
import ScrollReveal from '../../components/ScrollReveal';
import Pagination from '../Pagination';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
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

const WorkoutCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const WorkoutDate = styled.h3`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
`;

const WorkoutMeta = styled.div`
  margin-bottom: 15px;
  color: #666;
`;

const ExerciseSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #058E3A;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const ExerciseCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f5f9ff;
  border-radius: 10px;
  border: 1px solid #e0e9ff;
`;

const ExerciseName = styled.p`
  font-weight: bold;
  color: #05396B;
  margin-bottom: 5px;
`;

const ExerciseDetail = styled.p`
  color: #666;
  margin-bottom: 3px;
  font-size: 0.9rem;
`;

const CommentCard = styled.div`
  padding: 15px;
  margin-top: 20px;
  background-color: #f0f7ff;
  border-radius: 10px;
  border: 1px solid #d0e3ff;
`;

const CommentText = styled.p`
  color: #05396B;
  margin-bottom: 5px;
`;

const CommentDate = styled.small`
  color: #888;
  font-size: 0.8rem;
`;

const NoComments = styled.div`
  padding: 15px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #eee;
  color: #666;
  text-align: center;
`;

const WorkoutList: React.FC<{ refresh: boolean; clientId?: number }> = ({ refresh, clientId }) => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const workoutsPerPage = 3;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const role = jwtDecode(localStorage.getItem('token')).role;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const endpoint = clientId ? `/workouts/client/${clientId}` : '/workouts';
        const response = await api.get(endpoint);
        
        // Filter out pending workouts for clients
        const filteredWorkouts = role === 'client' 
          ? response.data.filter((w: any) => w.status !== 'pending')
          : response.data;

        const workoutsWithExercises = await Promise.all(
          filteredWorkouts.map(async (workout: any) => {
            const exercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
            const commentsResponse = await api.get(`/workout-comments/${workout.id}`);
            return { ...workout, exercises: exercisesResponse.data, comments: commentsResponse.data };
          })
        );
        
        // Сортировка по дате (новые сверху)
        workoutsWithExercises.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (dateA === dateB) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return dateB - dateA;
        });
        
        setWorkouts(workoutsWithExercises);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [refresh, clientId, update, role]);

  const handleCommentAdded = () => {
    setUpdate(!update);
  };

  // Пагинация
  const indexOfLastWorkout = currentPage * workoutsPerPage;
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage;
  const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout);
  const totalPages = Math.ceil(workouts.length / workoutsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
        {workouts.length === 0 ? (
          <EmptyMessage>Вы пока не добавляли тренировок!</EmptyMessage>
        ) : (
          <>
            {currentWorkouts.map((workout) => {
              if(workout.status === 'assigned' || workout.status === 'completed' || workout.status === null){
                return (
                  <ScrollReveal delay={0.05} key={workout.id}>
                  <WorkoutCard>
                    <WorkoutDate>
                      {new Date(workout.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </WorkoutDate>
                    
                    {(role === 'client' || role === 'trainer') && (
                      <>
                        {workout.name && <ExerciseName>{workout.name}</ExerciseName>}
                        {/* {workout.type && <WorkoutMeta>Тип: {workout.type}</WorkoutMeta>} */}
                        <WorkoutMeta>
                          Тип: {workout.trainer_id ? 'Назначенная' : 'Личная'} тренировка
                          {workout.type && ` • ${workout.type}`}
                        </WorkoutMeta>
                        {workout.description && <WorkoutMeta>Описание: {workout.description}</WorkoutMeta>}
                      </>
                    )}
  
                    {workout.duration && (<WorkoutMeta>Длительность: {workout.duration} минут</WorkoutMeta>)}
                    
                    {role === 'client' && workout.feeling && (
                      <WorkoutMeta>Ощущения: {workout.feeling}</WorkoutMeta>
                    )}
                    
                    <ExerciseSection>
                      <SectionTitle>Упражнения:</SectionTitle>
                      {workout.exercises?.map((exercise: any) => (
                        <ExerciseCard key={exercise.id}>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <ExerciseDetail>Категория: {exercise.category}</ExerciseDetail>
                          
                          {exercise.category === 'Бег' ? (
                            <>
                              <ExerciseDetail>Продолжительность: {exercise.duration} минут</ExerciseDetail>
                              <ExerciseDetail>Расстояние: {exercise.distance} км</ExerciseDetail>
                              <ExerciseDetail>
                                Средняя скорость: {(exercise.distance / (exercise.duration / 60)).toFixed(2)} км/ч
                              </ExerciseDetail>
                            </>
                          ) : (
                            <>
                              <ExerciseDetail>Подходы: {exercise.sets}</ExerciseDetail>
                              <ExerciseDetail>Повторения: {exercise.reps}</ExerciseDetail>
                              {exercise.weight > 0 && (
                                <ExerciseDetail>Вес: {exercise.weight} кг</ExerciseDetail>
                              )}
                            </>
                          )}
                        </ExerciseCard>
                      ))}
                    </ExerciseSection>
                    
                    <CommentCard>
                      <SectionTitle>Комментарии тренера:</SectionTitle>
                      {workout.comments?.length > 0 ? (
                        workout.comments.map((comment: any) => (
                          <div key={comment.id}>
                            <CommentText>{comment.comment}</CommentText>
                            <CommentDate>
                              {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </CommentDate>
                          </div>
                        ))
                      ) : (
                        <NoComments>
                          {role === 'client' ? 
                            'Ваш тренер пока не оставлял комментариев' : 
                            'Вы пока не оставляли комментариев'}
                        </NoComments>
                      )}
                    </CommentCard>
                    
                    {role === 'trainer' && (
                      <AddWorkoutComment 
                        workoutId={workout.id} 
                        onCommentAdded={handleCommentAdded} 
                      />
                    )}
                  </WorkoutCard>
                </ScrollReveal>
                )
              }else if(workout.status === 'skipped'){
                return (
                  <ScrollReveal delay={0.05} key={workout.id}>
                  <WorkoutCard>
                    <WorkoutDate>
                      {new Date(workout.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </WorkoutDate>
                    <h3 style={{color: '#930204'}}>Тренировка не выполнена (пропущена)</h3><br/>
                    
                    {(role === 'client' || role === 'trainer') && (
                      <>
                        {workout.name && <ExerciseName>{workout.name}</ExerciseName>}
                        {/* {workout.type && <WorkoutMeta>Тип: {workout.type}</WorkoutMeta>} */}
                        <WorkoutMeta>
                          Тип: {workout.trainer_id ? 'Назначенная' : 'Личная'} тренировка
                          {workout.type && ` • ${workout.type}`}
                        </WorkoutMeta>
                        {workout.description && <WorkoutMeta>Описание: {workout.description}</WorkoutMeta>}
                      </>
                    )}
  
                    {workout.duration && (<WorkoutMeta>Длительность: {workout.duration} минут</WorkoutMeta>)}
                    
                    {role === 'client' && workout.feeling && (
                      <WorkoutMeta>Ощущения: {workout.feeling}</WorkoutMeta>
                    )}
                    
                    <ExerciseSection>
                      <SectionTitle>Упражнения:</SectionTitle>
                      {workout.exercises?.map((exercise: any) => (
                        <ExerciseCard key={exercise.id}>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <ExerciseDetail>Категория: {exercise.category}</ExerciseDetail>
                          
                          {exercise.category === 'Бег' ? (
                            <>
                              <ExerciseDetail>Продолжительность: {exercise.duration} минут</ExerciseDetail>
                              <ExerciseDetail>Расстояние: {exercise.distance} км</ExerciseDetail>
                              <ExerciseDetail>
                                Средняя скорость: {(exercise.distance / (exercise.duration / 60)).toFixed(2)} км/ч
                              </ExerciseDetail>
                            </>
                          ) : (
                            <>
                              <ExerciseDetail>Подходы: {exercise.sets}</ExerciseDetail>
                              <ExerciseDetail>Повторения: {exercise.reps}</ExerciseDetail>
                              {exercise.weight > 0 && (
                                <ExerciseDetail>Вес: {exercise.weight} кг</ExerciseDetail>
                              )}
                            </>
                          )}
                        </ExerciseCard>
                      ))}
                    </ExerciseSection>
                    
                    <CommentCard>
                      <SectionTitle>Комментарии тренера:</SectionTitle>
                      {workout.comments?.length > 0 ? (
                        workout.comments.map((comment: any) => (
                          <div key={comment.id}>
                            <CommentText>{comment.comment}</CommentText>
                            <CommentDate>
                              {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </CommentDate>
                          </div>
                        ))
                      ) : (
                        <NoComments>
                          {role === 'client' ? 
                            'Ваш тренер пока не оставлял комментариев' : 
                            'Вы пока не оставляли комментариев'}
                        </NoComments>
                      )}
                    </CommentCard>
                    
                    {role === 'trainer' && (
                      <AddWorkoutComment 
                        workoutId={workout.id} 
                        onCommentAdded={handleCommentAdded} 
                      />
                    )}
                  </WorkoutCard>
                </ScrollReveal>
                )
              }
            })}
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            )}
          </>
        )}
    </Container>
  );
};

export default WorkoutList;