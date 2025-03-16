import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { Link } from 'react-router-dom';

type LikeButtonProps = {
    isLiked: boolean;
};

type FavoriteButtonProps = {
    isFavorite: boolean;
};

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const LikeButton = styled.button<LikeButtonProps>`
  padding: 5px 10px;
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

const FavoriteButton = styled.button<FavoriteButtonProps>`
  padding: 5px 10px;
  background-color: ${(props) => (props.isFavorite ? '#dc3545' : '#6c757d')};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isFavorite ? '#c82333' : '#5a6268')};
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProgramCard: React.FC<{ program: any }> = ({ program }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(program.likes_count || 0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const likedResponse = await api.get(`/programs/likes/${program.id}/is-liked`);
        setIsLiked(likedResponse.data.isLiked);

        const favoriteResponse = await api.get(`/favorites/${program.id}/is-favorite`);
        setIsFavorite(favoriteResponse.data.isFavorite);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLikeStatus();
  }, [program.id]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.post('/programs/likes/unlike', { program_id: program.id });
        setLikesCount(likesCount - 1);
      } else {
        await api.post('/programs/likes/like', { program_id: program.id });
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
        await api.post('/favorites/remove', { program_id: program.id });
      } else {
        await api.post('/favorites/add', { program_id: program.id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <Link to={`/programs/${program.id}`}>
        <h3>{program.name}</h3>
        <p>{program.description.length > 40 ? `${program.description.substring(0, 40)}...` : program.description}</p>
        <p>Author: {program.author_username}</p>
      </Link>
      <div>
        <LikeButton isLiked={isLiked} onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </LikeButton>
        <FavoriteButton isFavorite={isFavorite} onClick={handleFavorite}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </FavoriteButton>
      </div>
    </Card>
  );
};

export default ProgramCard;