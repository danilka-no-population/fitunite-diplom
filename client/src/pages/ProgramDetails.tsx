/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

type ButtonProps = {
    isLiked: boolean;
  };

const LikeButton = styled.button<ButtonProps>`
  padding: 10px;
  margin-right: 10px;
  background-color: ${(props) => (props.isLiked ? '#28a745' : '#007bff')};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${(props) => (props.isLiked ? '#218838' : '#0056b3')};
  }
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

const CommentForm = styled.form`
  margin-top: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const CommentCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [likesCount, setLikesCount] = useState(0);

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
      setComments([response.data, ...comments]); // response.data теперь содержит username
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

  if (!program) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>{program.name}</h1>
      <LikeButton isLiked={isLiked} onClick={handleLike} style={{margin: '10px 0'}}>
        {isLiked ? '❤️' : '🤍'} {likesCount}
      </LikeButton>
      <Button onClick={handleFavorite}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
      <p>{program.description}</p>
      <p>Author: {program.author_username}</p>
      <p>Created at: {new Date(program.created_at).toLocaleDateString()}</p>

      <CommentForm onSubmit={handleCommentSubmit}>
        <CommentInput
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <Button type="submit">Submit</Button>
      </CommentForm>

      <CommentList>
        {comments.map((comment) => (
          <CommentCard key={comment.id}>
            <p>{comment.comment}</p>
            <p>By: {comment.username}</p>
            {currentUserId === comment.user_id && (
              <Button onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
            )}
          </CommentCard>
        ))}
      </CommentList>
    </Container>
  );
};

export default ProgramDetail;