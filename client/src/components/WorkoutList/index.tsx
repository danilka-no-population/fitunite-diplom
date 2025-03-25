/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import AddWorkoutComment from '../AddWorkoutComment';
import { jwtDecode } from 'jwt-decode';

const Container = styled.div`
  padding: 20px;
`;

const WorkoutCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const ExerciseCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const CommentCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const WorkoutList: React.FC<{ refresh: boolean; clientId?: number }> = ({ refresh, clientId }) => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [update, setUpdate] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const role = jwtDecode(localStorage.getItem('token')).role;

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const endpoint = clientId ? `/workouts/client/${clientId}` : '/workouts';
        const response = await api.get(endpoint);
        const workoutsWithExercises = await Promise.all(
          response.data.map(async (workout: any) => {
            const exercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
            const commentsResponse = await api.get(`/workout-comments/${workout.id}`);
            return { ...workout, exercises: exercisesResponse.data, comments: commentsResponse.data };
          })
        );
        setWorkouts(workoutsWithExercises);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [refresh, clientId, update]);

  const handleCommentAdded = () => {
    setWorkouts((prevWorkouts) => [...prevWorkouts]);
    setUpdate(!update);
  };

  return (
    <Container>
      <h1>{clientId ? "Тренировки клиента" : 'Мои тренировки'}</h1>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id}>
          {clientId && <h5>{new Date(workout.date).toLocaleDateString()}</h5>}
          {role === 'trainer' && (
            <>
              {workout.name ? <h3>{workout.name}</h3> : null}
              {workout.type ? <p>Тип: {workout.type}</p> : null}
              {workout.description ? <p>Описание: {workout.description}</p> : null}
            </>
          )}
          {role === 'client' && <h3>{new Date(workout.date).toLocaleDateString()}</h3>}
          <p>Длительность: {workout.duration} минут</p>
          {role === 'client' && <p>Ощущения: {workout.feeling}</p>}
          <h4>Упражнения:</h4>
          {workout.exercises?.map((exercise: any) => (
            <ExerciseCard key={exercise.id}>
              <p>Упражнение: {exercise.name}</p>
              <p>Категория: {exercise.category}</p>
              {exercise.type === 'cardio' ? (
                <>
                  <p>Продолжительность: {exercise.duration} минут</p>
                  <p>Расстояние: {exercise.distance} км</p>
                  <p>Средняя скорость: {Number(exercise.distance) / (Number(exercise.duration) / 60)} км/ч</p>
                </>
              ) : (
                <>
                  <p>Подходы: {exercise.sets}</p>
                  <p>Повторения: {exercise.reps}</p>
                  <p>Вес: {exercise.weight} кг</p>
                </>
              )}
            </ExerciseCard>
          ))}
          <h4>Комментарии от тренера:</h4>
          {workout.comments?.map((comment: any) => (
            <CommentCard key={comment.id}>
              <p>{comment.comment}</p>
              <small>{new Date(comment.created_at).toLocaleString()}</small>
            </CommentCard>
          ))}
          {workout.comments.length === 0 && (role === 'client' ? (
            <CommentCard>
              <p>Ваш тренер пока не оставлял комментариев!</p>
            </CommentCard>
          ) : (
            <CommentCard>
              <p>Вы пока не оставляли комментариев!</p>
            </CommentCard>
          ))}
          {role === 'trainer' && <AddWorkoutComment workoutId={workout.id} onCommentAdded={handleCommentAdded} />}
        </WorkoutCard>
      ))}
    </Container>
  );
};

export default WorkoutList;