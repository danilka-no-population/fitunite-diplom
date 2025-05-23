/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ScrollReveal from '../components/ScrollReveal';
import Pagination from '../components/Pagination';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e9ff;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background-color: transparent;
  border: none;
  border-bottom: ${props => props.active ? '3px solid #058E3A' : 'none'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  color: ${props => props.active ? '#05396B' : '#666'};
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 50%;
  
  &:hover {
    color: #05396B;
  }

  @media (max-width: 400px){
    font-size: 0.8rem;
  }
`;

const CreateButton = styled.button`
  padding: 15px 20px;
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: #046b2d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 450px){
    font-size: 0.9rem;
    padding: 10px 15px;
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

const ProgramMeta = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 0.95rem;
`;

const ProgramAuthor = styled.div`
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  color: #05396B;
  font-weight: 500;
`;

const ProgramVisibility = styled.div`
  color: #ffffff;
  font-weight: 600;
  background-color: ${props => props.color};
  width: fit-content;
  padding: 8px 17px;
  text-align: center;
  border-radius: 10px;

  @media (max-width: 550px){
    padding: 5px 15px;
    font-size: 0.9rem;
  }
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

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 450px){
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
`

const ProgramList: React.FC = () => {
  const [publicPrograms, setPublicPrograms] = useState<any[]>([]);
  const [myPrograms, setMyPrograms] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const [userRole, setUserRole] = useState<string>('');
  const [myId, setMyId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const programsPerPage = 5;
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<{ [key: number]: { username: string; fullname: string } }>({});

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');


  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const publicResponse = await api.get('/programs/public');
        setPublicPrograms(publicResponse.data);

        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          setUserRole(decodedToken.role);
          setMyId(decodedToken.id);

          if (decodedToken.role === 'trainer') {
            const myResponse = await api.get('/programs/my');
            setMyPrograms(myResponse.data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const loadAuthors = async () => {
      // Собираем уникальные author_id
      const allPrograms = [...publicPrograms, ...myPrograms];
      const uniqueIds = [...new Set(allPrograms.map(p => p.author_id))];
  
      const newAuthors: typeof authors = { ...authors };
  
      for (const id of uniqueIds) {
        if (!newAuthors[id]) {
          try {
            const res = await api.get(`/profile/${id}`);
            newAuthors[id] = {
              username: res.data.username,
              fullname: res.data.fullname,
            };
          } catch (err) {
            console.error(`Ошибка при получении автора ${id}:`, err);
          }
        }
      }
  
      setAuthors(newAuthors);
    };
  
    if (publicPrograms.length || myPrograms.length) {
      loadAuthors();
    }
  }, [publicPrograms, myPrograms]);

  const filteredPublicPrograms = publicPrograms.filter(program => {
    const matchesType = selectedType === 'all' || program.type === selectedType;
    const matchesDuration =
      selectedDuration === 'all' ||
      (selectedDuration === '7' && program.days_count <= 7) ||
      (selectedDuration === '30' && program.days_count > 7 && program.days_count <= 30) ||
      (selectedDuration === '90' && program.days_count > 30);
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesDuration && matchesSearch;
  });

  // Пагинация
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPublicPrograms = filteredPublicPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const currentMyPrograms = myPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPublicPages = Math.ceil(filteredPublicPrograms.length / programsPerPage);
  const totalMyPages = Math.ceil(myPrograms.length / programsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
      <ScrollReveal delay={0.1}><Title>Программы тренировок</Title></ScrollReveal>
      
      {userRole === 'trainer' && (
        <>
          <ScrollReveal delay={0.2}>
            <Tabs>
              <Tab 
                active={activeTab === 'public'}
                onClick={() => {
                  setActiveTab('public');
                  setCurrentPage(1);
                }}
              >
                Общедоступные
              </Tab>
              <Tab 
                active={activeTab === 'my'}
                onClick={() => {
                  setActiveTab('my');
                  setCurrentPage(1);
                  setSelectedType('all')
                  setSearchTerm('')
                  setSelectedDuration('all')
                }}
              >
                Мои программы
              </Tab>
            </Tabs>
          </ScrollReveal>

          {activeTab === 'my' && (
            <ScrollReveal delay={0.1}>
              <CreateButton onClick={() => navigate('/create-program')}>
                Создать программу
              </CreateButton>
            </ScrollReveal>
          )}
        </>
      )}

      {activeTab === 'public' && userRole === 'trainer' && (
        <ScrollReveal delay={0.2}>
          {
            selectedType === 'all' && selectedDuration === 'all' && searchTerm === '' ? (
              <Count></Count>
            ) : (
              <ScrollReveal delay={0.05}>
                <div style={{ marginBottom: '30px', fontSize: '1.2rem', fontWeight: '400', color: '#058E3A', textAlign: 'center' }}>
                Найдено <b>{currentPublicPrograms.length}</b> {currentPublicPrograms.length === 1 ? 'программа' : 
                  currentPublicPrograms.length >= 2 && currentPublicPrograms.length <= 4 ? 'программы' : 'программ'}
                </div>
              </ScrollReveal>
            )
          }
          <FiltersContainer>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="Оздоровление">Оздоровление</option>
              <option value="Сила">Сила</option>
              <option value="Выносливость">Выносливость</option>
              <option value="Укрепление мышечного корсета">Укрепление мышечного корсета</option>
              <option value="Комбинированная">Комбинированная</option>
            </Select>

            <Select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
              <option value="all">Все длительности</option>
              <option value="7">7 дней</option>
              <option value="30">30 дней</option>
              <option value="90">90 дней</option>
            </Select>

            <SearchInput
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FiltersContainer>
        </ScrollReveal>
      )}

      {activeTab === 'public' && userRole !== 'trainer' && (
        <ScrollReveal delay={0.2}>
          {
            selectedType === 'all' && selectedDuration === 'all' && searchTerm === '' ? (
              <Count></Count>
            ) : (
              <ScrollReveal delay={0.05}>
                <div style={{ marginBottom: '30px', fontSize: '1.2rem', fontWeight: '400', color: '#058E3A', textAlign: 'center' }}>
                Найдено <b>{currentPublicPrograms.length}</b> {currentPublicPrograms.length === 1 ? 'программа' : 
                  currentPublicPrograms.length >= 2 && currentPublicPrograms.length <= 4 ? 'программы' : 'программ'}
                </div>
              </ScrollReveal>
            )
          }
          <FiltersContainer>
            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="Оздоровление">Оздоровление</option>
              <option value="Сила">Сила</option>
              <option value="Выносливость">Выносливость</option>
              <option value="Укрепление мышечного корсета">Укрепление мышечного корсета</option>
              <option value="Комбинированная">Комбинированная</option>
            </Select>

            <Select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)}>
              <option value="all">Все длительности</option>
              <option value="7">7 дней</option>
              <option value="30">30 дней</option>
              <option value="90">90 дней</option>
            </Select>

            <SearchInput
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FiltersContainer>
        </ScrollReveal>
      )}

      {(activeTab === 'public' || userRole !== 'trainer') && (
        <>
          {currentPublicPrograms.length > 0 ? (
            currentPublicPrograms.map((program) => (
              <Link to={`/programs/${program.id}`} key={program.id} style={{ textDecoration: 'none' }}>
                {/* <ScrollReveal delay={0.3}>
                  <ProgramCard>
                    <ProgramName>{program.name}</ProgramName>
                    <ProgramMeta>Тип: {program.type}</ProgramMeta>
                    <ProgramMeta>Продолжительность: {program.days_count} дней</ProgramMeta>
                    <ProgramMeta>Тренировок: {program.workouts_count}</ProgramMeta>
                    {program.author_id === myId && (
                      <ProgramAuthor>Это ваша программа</ProgramAuthor>
                    )}
                  </ProgramCard>
                </ScrollReveal> */}
                <ScrollReveal delay={0.3}>
                  <ProgramCard>
                    <TitleContainer>
                      <ProgramName>{program.name}</ProgramName>
                      <ProgramVisibility color={program.is_public ? '#058E3A' : '#A80003'}>
                        {program.is_public ? 'Общедоступная' : 'Приватная'}
                      </ProgramVisibility>
                    </TitleContainer>
                    {/* <ProgramName>{program.name}</ProgramName> */}
                    <ProgramMeta style={{color: '#058E3A'}}><b>Тип:</b> {program.type}</ProgramMeta>
                    <ProgramMeta style={{color: '#058E3A'}}><b>Продолжительность:</b> {program.days_count} дней</ProgramMeta>
                    <ProgramMeta style={{color: '#058E3A'}}><b>Тренировок:</b> {program.workouts_count}</ProgramMeta>
                    {program.author_id === myId ? (
                      <ProgramAuthor>Это ваша программа</ProgramAuthor>
                    ) : <ProgramAuthor><b>Автор:</b> {authors[program.author_id]?.fullname || '@' + authors[program.author_id]?.username || 'Загрузка...'}</ProgramAuthor>}
                  </ProgramCard>
                </ScrollReveal>
              </Link>
            ))
          ) : (
            // <ScrollReveal delay={0.3}>
            //   <EmptyMessage>Нет доступных программ тренировок</EmptyMessage>
            // </ScrollReveal>
            <EmptyMessage>Нет доступных программ тренировок</EmptyMessage>
          )}

          {totalPublicPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPublicPages}
              paginate={paginate}
            />
          )}
        </>
      )}

      {activeTab === 'my' && userRole === 'trainer' && (
        <>
          {currentMyPrograms.length > 0 ? (
            currentMyPrograms.map((program) => (
              <Link to={`/programs/${program.id}`} key={program.id} style={{ textDecoration: 'none' }}>
                <ScrollReveal delay={0.1}>
                  <ProgramCard>
                    <TitleContainer>
                      <ProgramName>{program.name}</ProgramName>
                      <ProgramVisibility color={program.is_public ? '#058E3A' : '#A80003'}>
                        {program.is_public ? 'Общедоступная' : 'Приватная'}
                      </ProgramVisibility>
                    </TitleContainer>
                    
                    <ProgramMeta style={{color: '#058E3A'}}><b>Тип:</b> {program.type}</ProgramMeta>
                    <ProgramMeta style={{color: '#058E3A'}}><b>Продолжительность:</b> {program.days_count} дней</ProgramMeta>
                    <ProgramMeta style={{color: '#058E3A'}}><b>Тренировок:</b> {program.workouts_count}</ProgramMeta>
                  </ProgramCard>
                </ScrollReveal>
              </Link>
            ))
          ) : (
            <ScrollReveal>
              <EmptyMessage>У вас пока нет созданных программ</EmptyMessage>
            </ScrollReveal>
          )}

          {totalMyPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalMyPages}
              paginate={paginate}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default ProgramList;