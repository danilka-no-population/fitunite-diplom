/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
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

  @media (max-width: 450px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.2rem;
  }
`;

const ProgramCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProgramName = styled.h3`
  color: #05396B;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const ProgramDescription = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 0.95rem;
  line-height: 1.5;
  width: 80%;

  @media (max-width: 600px){
    margin-bottom: 0;
    margin-top: -10px;
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
`;

const EmptyMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const BrowseButton = styled.button`
  padding: 15px 20px;
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #046b2d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 500px){
    font-size: 0.9rem;
  }

  @media (max-width: 400px){
    font-size: 0.8rem;
  }
`;

const RemoveButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#A80003' : '#A80003'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  @media (max-width: 600px){
    display: none;
  }
  
  &:hover {
    background-color: ${props => props.type === 'button' ? '#930204' : '#930204'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TinyRemoveButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#A80003' : '#A80003'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  margin-top: 20px;
  display: none;

  @media (max-width: 600px){
    display: block;
    font-size: 0.8rem;
    padding: 10px 15px;
    width: 100%;
  }
  
  &:hover {
    background-color: ${props => props.type === 'button' ? '#930204' : '#930204'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px){
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 10px;
  }
`

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 25px;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 550px) {
    flex-direction: column;
    align-items: stretch;
  }
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

const Select = styled.select`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  flex: 1;
  min-width: 150px;
  
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

const Count = styled.div`
  font-size: 1rem;
`;



const Favorites: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [favorites, setFavorites] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const favoritesPerPage = 5;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [loading, setLoading] = useState(true);
  const isFirstLoad = React.useRef(true);


  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites/my-favorites');
      setFavorites(response.data);
      setLoading(false);
      isFirstLoad.current = false;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFavorite = async (id: number) => {
    try {
      await api.post('/favorites/remove', { program_id: id });
      setFavorites(prev => prev.filter(fav => fav.program_id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [favorites.length]);

  const filteredFavorites = favorites.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesType = selectedType === 'all' || program.type === selectedType;
  
    const matchesDuration =
      selectedDuration === 'all' ||
      (selectedDuration === '7' && program.days_count <= 7) ||
      (selectedDuration === '30' && program.days_count > 7 && program.days_count <= 30) ||
      (selectedDuration === '90' && program.days_count > 30);
  
    return matchesSearch && matchesType && matchesDuration;
  });

  // Пагинация
  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
  const currentFavorites = filteredFavorites.slice(indexOfFirstFavorite, indexOfLastFavorite);
  const totalPages = Math.ceil(filteredFavorites.length / favoritesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
      <ScrollReveal>
        <Title>Избранное</Title>
      </ScrollReveal>

      {loading ? <Loader/> : (
  <>
    {favorites.length > 0 && (
      <ScrollReveal delay={0.2}>
        {(selectedType === 'all' && selectedDuration === 'all' && searchTerm === '') ? (
          <Count></Count>
        ) : (
          <ScrollReveal delay={0.05}>
            <div style={{ marginBottom: '30px', fontSize: '1.2rem', fontWeight: '400', color: '#058E3A', textAlign: 'center' }}>
              Найдено <b>{filteredFavorites.length}</b> {filteredFavorites.length === 1 ? 'программа' : 
                filteredFavorites.length >= 2 && filteredFavorites.length <= 4 ? 'программы' : 'программ'}
            </div>
          </ScrollReveal>
        )}
        <FiltersContainer>
          <SearchInput
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FiltersContainer>
      </ScrollReveal>
    )}

    {filteredFavorites.length === 0 && favorites.length === 0 ? (
      <ScrollReveal delay={0.2}>
        <EmptyContainer>
          <EmptyMessage>Вы пока что не добавляли ничего в избранное!</EmptyMessage>
          <BrowseButton onClick={() => navigate('/programs')}>
            Перейти к программам
          </BrowseButton>
        </EmptyContainer>
      </ScrollReveal>
    ) : (
      <>
        {currentFavorites.map((favorite) => (
          <Link
            to={`/programs/${favorite.program_id}`}
            key={favorite.id}
            style={{ textDecoration: 'none' }}
          >
            <ScrollReveal delay={0.2}>
              <ProgramCard>
                <TitleContainer>
                  <ProgramName>{favorite.name}</ProgramName>
                  <RemoveButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteFavorite(favorite.program_id);
                    }}
                  >Удалить</RemoveButton>
                </TitleContainer>
                <ProgramDescription>
                  {favorite.description.length > 100
                    ? `${favorite.description.substring(0, 100)}...`
                    : favorite.description}
                  {favorite.description.length === 0 &&
                    `Описание отсутствует. Кликните на программу чтобы узнать о ней более подробно...`
                  }
                </ProgramDescription>
                <TinyRemoveButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteFavorite(favorite.program_id);
                  }}
                >
                  Удалить
                </TinyRemoveButton>
              </ProgramCard>
            </ScrollReveal>
          </Link>
        ))}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </>
    )}
  </>
)}

    </Container>
  );
};

export default Favorites;