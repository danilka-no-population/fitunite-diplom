import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
`;

const ProgramCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const Favorites: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [favorites, setFavorites] = useState<any[]>([]);

//   const fetchFavorites = async () => {
//     try {
//       const response = await api.get('/favorites/my-favorites');
//       setFavorites(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites/my-favorites');
      console.log('Favorites data:', response.data); // Логируем данные
      setFavorites(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <Container>
      <h1>Favorites</h1>
      {favorites.map((favorite) => (
        <Link to={`/programs/${favorite.program_id}`} key={favorite.id}>
          <ProgramCard>
            <h3>{favorite.name}</h3>
            <p>{favorite.description}</p>
          </ProgramCard>
        </Link>
      ))}
    </Container>
  );
};

export default Favorites;