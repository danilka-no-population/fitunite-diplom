/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 20px;
`;

const Button = styled.button`
  padding: 10px;
  margin-right: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WorkoutCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const ExerciseCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 2px solid #eee;
  border: 2px solid rgba(0, 131, 187, 0.84);
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
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
    try {
      const response = await api.post('/programs/comments/comment', {
        program_id: id,
        comment: newComment,
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
    } catch (error) {
      console.error(error);
    }
  };

  if (!program) {
    return <Container><h2>Loading...</h2></Container>;
  }

  return (
    <Container>
      <h1>{program.name}</h1>
      <p>Тип: {program.type}</p>
      <p>Продолжительность: {program.days_count} дней</p>
      <p>Кол-во тренировок: {program.workouts_count}</p>
      <p>Автор: {program.author_fullname || program.author_username}</p>
      <p>Дата создания: {new Date(program.created_at).toLocaleDateString()}</p>
      <p>{program.is_public ? 'Общедоступная' : 'Приватная'}</p>
      {program.description && <><br/><h3>Описание:</h3>{program.description}<br/><br/></>}

      <Button onClick={handleLike} style={{ margin: '10px 0' }}>
        {isLiked ? '❤️' : '🤍'} {likesCount}
      </Button>
      <Button onClick={handleFavorite}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>

      <h2>Тренировки: </h2>
      {program.workouts?.map((workout: any) => (
        <WorkoutCard key={workout.id} onClick={() => openWorkoutModal(workout.id)}>
          <h3>{workout.name || `Workout #${workout.id}`}</h3>
          <p>Type: {workout.type}</p>
          <p>Duration: {workout.duration} minutes</p>
        </WorkoutCard>
      ))}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Workout Details"
      >
        <ModalContent>
          {selectedWorkout && (
            <>
              <h2 onClick={() => setModalIsOpen(false)} style={{position: 'absolute', right: '20px', top: '20px', cursor: 'pointer'}}>❌</h2>
              <h2>{selectedWorkout.name || `Workout #${selectedWorkout.id}`}</h2>
              <p>Тип: {selectedWorkout.type}</p>
              <p>Длительность тренировки: {selectedWorkout.duration} мин.</p>
              {selectedWorkout.description && <div style={{margin: '10px 0'}}>
                <h4>Дополнительные инструкции:</h4>
                <p>{selectedWorkout.description}</p>
              </div>}

              <h3>Упражнения:</h3>
              {selectedWorkout.exercises?.map((exercise: any) => (
                <ExerciseCard key={exercise.id}>
                  <h3>{exercise.name}</h3>
                  <p>Категория: {exercise.category}</p>
                  <div style={{width: '100%', fontWeight: 'bold', height: '2px', backgroundColor: 'black', margin: '10px 0'}}></div>
                  {exercise.type === 'cardio' ? (
                    <>
                      <p>Время бега: {exercise.duration} мин.</p>
                      <p>Дистанция, которую необходимо пробежать: {exercise.distance} км</p>
                      <p>Средняя скорость: {exercise.distance / (exercise.duration / 60)} км/ч</p>
                    </>
                  ) : (
                    <>
                      <p>Кол-во <b>подходов:</b> {exercise.sets}</p>
                      <p>Кол-во <b>повторений:</b> {exercise.reps}</p>
                      <p>Вес, с которым нужно выполнять: {exercise.weight} кг</p>
                    </>
                  )}
                </ExerciseCard>
              ))}
            </>
          )}
          <Button onClick={() => setModalIsOpen(false)}>Close</Button>
        </ModalContent>
      </Modal>

      <h2>Comments</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <Button type="submit">Submit</Button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee' }}>
          <p>{comment.comment}</p>
          <p>By: {comment.username}</p>
          {currentUserId === comment.user_id && (
            <Button 
              onClick={() => handleDeleteComment(comment.id)}
              style={{ backgroundColor: '#dc3545' }}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </Container>
  );
};

export default ProgramDetail;