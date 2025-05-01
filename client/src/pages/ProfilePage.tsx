/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';

// Интерфейсы и типы
interface AvatarProps {
  src: string;
}

interface MetricCardProps {
  $isFirst?: boolean;
}

interface ModalProps {
  $isOpen: boolean;
}

interface AssignedProgram {
  id: number;
  program_id: number;
  program_name: string;
  program_description?: string;
  assigned_at: string;
}

// Стилевые компоненты
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1rem;
  color: #333;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  margin-bottom: 1rem; // Увеличили отступ
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
`;

const Avatar = styled.div<AvatarProps>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${(props) => (props.src ? 'transparent' : '#e0e0e0')};
  background-image: ${(props) => (props.src ? `url(${props.src})` : 'none')};
  background-size: cover;
  background-position: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @media (max-width: 500px){
    width: 80px;
    height: 80px;
  }

  @media (max-width: 400px){
    width: 75px;
    height: 75px;
  }
`;

const AvatarEdit = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 5px;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  
  cursor: pointer;

  &:hover {
    ${AvatarEdit} {
      opacity: 1;
    }
    
    ${Avatar}::after {
      opacity: 1;
    }
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarError = styled.div`
  color: #A80003;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  margin-left: 10px;
  color: #05396B;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 500px){
    font-size: 1.3rem;
    margin-left: 0;
  }

  @media (max-width: 400px){
    font-size: 1.3rem;
    margin-bottom: 0rem;
  }

  @media (max-width: 375px){
    line-height: 1;
  }
`;

const ProfileRole = styled.span`
  display: inline-block;
  background-color: #058E3A;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 10px;
  @media (max-width: 500px){
    font-size: 0.7rem;
    margin-left: 0;
  }
  @media (max-width: 400px){
    padding: 0.2rem 0.6rem;
    font-size: 0.6rem;
  }
  @media (max-width: 375px){
    margin-top: 10px;
  }
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const ProfileSection = styled.section`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #05396B;
  display: flex;
  justify-content: space-between;

  @media (max-width: 500px){
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Field = styled.div`
  margin-bottom: 0.2rem;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem; // Увеличили отступ
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #05396B;
`;

const Value = styled.div`
  padding: 0.8rem;
  background-color: #F5F5F5;
  border-radius: 8px;
  color: #333;
  min-height: 44px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #5CDB94;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  &.error {
    border-color: #A80003;
    background-color: rgba(168, 0, 3, 0.05);
  }
`;

// const Select = styled.select`
//   width: 100%;
//   padding: 0.8rem;
//   border: 2px solid #e0e0e0;
//   border-radius: 8px;
//   font-size: 1rem;
//   transition: all 0.3s ease;
//   background-color: white;

//   &:focus {
//     border-color: #5CDB94;
//     outline: none;
//     box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
//   }
// `;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;

  &.primary {
    background-color: #058E3A;
    color: white;

    &:hover {
      background-color: #046b2d;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
    }
  }

  &.secondary {
    background-color: #F5F5F5;
    color: #333;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  &.danger {
    background-color: #A80003;
    color: white;

    &:hover {
      background-color: #8a0002;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #A80003;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MetricsSection = styled(ProfileSection)`
  text-align: center;
`;

const AddMetricButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const MetricCard = styled.div<MetricCardProps>`
  background-color: white;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #5CDB94;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const MetricDate = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const MetricValues = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const MetricValue = styled.div`
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const MetricNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #05396B;
`;

const NoMetrics = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.disabled ? '#058E3A' : '#F5F5F5'};
  color: ${props => props.disabled ? 'white' : '#333'};
  border: none;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
`;

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

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
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

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #05396B;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const DangerModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;

  @media (max-width: 500px) {
    font-size: 0.8rem;
  }
`;


const ProgramCard = styled.div`
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

const ProgramTitle = styled.h3`
  color: #05396B;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const ProgramMeta = styled.p`
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

// Основной компонент
const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trainerId, setTrainerId] = useState<number | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [height, setHeight] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [avatar, setAvatar] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHeight, setModalHeight] = useState('');
  const [modalWeight, setModalWeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const [assignedProgram, setAssignedProgram] = useState<AssignedProgram | null>(null);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

  const metricsPerPage = 4;
  const totalPages = Math.ceil(metrics.length / metricsPerPage);
  const currentMetrics = metrics.slice(
    (currentPage - 1) * metricsPerPage,
    currentPage * metricsPerPage
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
        setFullname(response.data.fullname || '');
        setPhoneNumber(response.data.phone_number || '');
        setTrainerId(response.data.trainer_id || '');
        setSpecialization(response.data.specialization || '');
        setAvatar(response.data.avatar || '');
        setHeight(response.data.height || null);

        const metricsResponse = await api.get('/profile/metrics');
        const sortedMetrics = metricsResponse.data.sort((a: any, b: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setMetrics(sortedMetrics);

        const trainersResponse = await api.get('/profile/trainers');
        setTrainers(trainersResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setModalWeight('')
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAssignedProgram = async () => {
      try {
        const response = await api.get('/assigned-programs/my-program');
        setAssignedProgram(response.data);
      } catch (error) {
        console.error(error);
        setAssignedProgram(null);
      }
    };
  
    if (user?.role === 'client') {
      fetchAssignedProgram();
    }
  }, [user]);

  const handleUnassignProgram = async () => {
    try {
      await api.post('/assigned-programs/unassign', { client_id: user?.id });
      setAssignedProgram(null);
      setIsUnassignModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const validateFullName = (name: string): string => {
      if (!name.trim()) return ''; // Пустая строка - нет ошибки
      
      const words = name.trim().split(/\s+/);
      if (words.length < 2 || name.trim().length < 5) {
        return 'ФИО должно содержать минимум 2 слова и 5 символов';
      }
      
      if (words.length > 5 || name.trim().length > 100) {
        return 'ФИО должно содержать не более 5 слов и 100 символов';
      }
      
      if (/[0-9_+*@#$%^&]/.test(name)) {
        return 'ФИО не должно содержать цифры и специальные символы';
      }
      
      return '';
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) return ''; // Пустая строка - нет ошибки
    
    if (!/^\+?\d{10,15}$/.test(phone)) {
      return 'Введите корректный номер телефона (только цифры, может начинаться с +)';
    }
    
    return '';
  };

  const validateMetrics = (heightVal: string, weightVal: string) => {
    const newErrors: Record<string, string> = {};
    
    // Проверяем рост только если он не установлен в профиле
    if (!height && heightVal) {
        const heightNum = parseFloat(heightVal);
        if (isNaN(heightNum) || heightNum < 100 || heightNum > 220) {
            newErrors.height = 'Рост должен быть от 100 до 220 см';
        }
    }
    
    if (weightVal) {
        const weightNum = parseFloat(weightVal);
        if (isNaN(weightNum) || weightNum < 10 || weightNum > 300) {
            newErrors.weight = 'Вес должен быть от 10 до 300 кг';
        }
    }
    
    if (!height && !heightVal && !weightVal) {
        newErrors.general = 'Введите хотя бы одно значение';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    
    const fullNameError = validateFullName(fullname);
    if (fullNameError) newErrors.fullname = fullNameError;
    
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) newErrors.phone = phoneError;

    // Добавляем валидацию роста
    const heightError = validateHeight(height);
    if (heightError) newErrors.height = heightError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Автоматическое скрытие ошибок через 5 секунд
      setTimeout(() => {
        setErrors({});
      }, 5000);
      
      return;
    }

    try {
      const response = await api.put('/profile', {
        fullname: fullname.trim() || null,
        phone_number: phoneNumber.trim() || null,
        trainer_id: trainerId || null,
        specialization: specialization.trim() || null,
        avatar,
        height: height || null
      });
      
      setUser(response.data);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error(error);
      setErrors({ general: 'Ошибка при сохранении профиля' });
      
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }
  };

  const validateHeight = (heightValue: number | null): string => {
    if (heightValue === null) return ''; // Пустое значение - допустимо
    
    if (heightValue < 100 || heightValue > 220) {
      return 'Рост должен быть от 100 до 220 см';
    }
    
    return '';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Проверка типа файла
    if (!file.type.match('image.*')) {
      setErrors({ avatar: 'Пожалуйста, выберите файл изображения' });
      setTimeout(() => setErrors({}), 5000);
      return;
    }
  
    // Проверка размера файла (максимум 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ avatar: 'Размер файла не должен превышать 2MB' });
      setTimeout(() => setErrors({}), 5000);
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      setAvatar(response.data.avatar);
    } catch (error) {
      console.error(error);
      setErrors({ avatar: 'Ошибка при загрузке аватара' });
      setTimeout(() => setErrors({}), 5000);
    } finally {
      // Сбрасываем значение input, чтобы можно было загрузить тот же файл снова
      e.target.value = '';
    }
  };

  const handleAddMetrics = async () => {
    const finalHeight = height ? height.toString() : modalHeight;
    
    if (!validateMetrics(finalHeight, modalWeight)) {
        setTimeout(() => {
            setErrors({});
        }, 5000);
        return;
    }

    try {
      await api.post('/profile/metrics', {
        height: finalHeight ? parseFloat(finalHeight) : null,
        weight: modalWeight ? parseFloat(modalWeight) : null,
      });
      
      const metricsResponse = await api.get('/profile/metrics');
      const sortedMetrics = metricsResponse.data.sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setMetrics(sortedMetrics);
      setModalHeight('');
      setModalWeight('');
      setIsModalOpen(false);
      setCurrentPage(1); // Вернуться на первую страницу после добавления
    } catch (error) {
      console.error(error);
      setErrors({ general: 'Некорректно введены метрики!' });
      
      setTimeout(() => {
        setErrors({});
      }, 5000);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'Номер телефона не указан';
    return phone; // Просто возвращаем как есть
  };

  if (!user) {
    return <ProfileContainer>Загрузка...</ProfileContainer>;
  }

  return (
    <ProfileContainer>
      {/* Модальное окно для добавления метрик */}
      <ScrollReveal delay={0.9}>
        <ModalOverlay $isOpen={isModalOpen}>
          <ModalContent ref={modalRef}>
            <ModalClose onClick={() => setIsModalOpen(false)}>×</ModalClose>
            <ModalTitle>Добавить метрики</ModalTitle>
            
            {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
            
            <Field>
              <Label>Рост (см)</Label>
              <Input
                  type="number"
                  placeholder="100-220 см"
                  value={height ? height.toString() : modalHeight}
                  onChange={(e) => {
                      if (!height) { // Разрешаем изменение только если рост не установлен в профиле
                          setModalHeight(e.target.value.replace(/[^0-9]/g, ''));
                      }
                  }}
                  disabled={!!height} // Блокируем поле, если рост установлен в профиле
                  className={errors.height ? 'error' : ''}
              />
              {errors.height && <ErrorMessage>{errors.height}</ErrorMessage>}
            </Field>
            
            <Field>
              <Label>Вес (кг)</Label>
              <Input
                type="number"
                placeholder="10-300 кг"
                value={modalWeight}
                onChange={(e) => setModalWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                className={errors.weight ? 'error' : ''}
              />
              {errors.weight && <ErrorMessage>{errors.weight}</ErrorMessage>}
            </Field>
            
            <DangerModalActions>
              <Button className="secondary" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>
              <Button className="primary" onClick={handleAddMetrics}>
                Добавить
              </Button>
            </DangerModalActions>
          </ModalContent>
        </ModalOverlay>
      </ScrollReveal>

      {/* Шапка профиля */}
      <ScrollReveal delay={0.1}>
        <ProfileHeader>
        <AvatarContainer onClick={() => document.getElementById('avatar-upload')?.click()}>
          <Avatar src={avatar}>
            {!avatar && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '3rem',
                color: '#999',
                zIndex: 1
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          
          <AvatarEdit>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

          </AvatarEdit>
          
          <AvatarInput
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </AvatarContainer>
        {errors.avatar && <AvatarError>{errors.avatar}</AvatarError>}

          <ProfileInfo>
            <ProfileTitle>
              {user.fullname || user.username}
            </ProfileTitle>
            <ProfileRole style={{marginBottom: '0'}}>
              {user.role === 'client' ? 'Клиент' : 'Тренер'}
            </ProfileRole>
            
          </ProfileInfo>
          
        </ProfileHeader>
      </ScrollReveal>

      {/* Основная информация */}
      <ScrollReveal delay={0.3}>
        <ProfileSection>
          <SectionTitle>Основная информация</SectionTitle>
          
          {isEditing ? (
            <>
              {/* <Field>
                <Label>Имя пользователя</Label>
                <Value>{user.username}</Value>
              </Field>
              
              <Field>
                <Label>Email</Label>
                <Value>{user.email}</Value>
              </Field> */}
              
              <Field>
                <Label>ФИО</Label>
                <Input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Введите ваше полное имя"
                  className={errors.fullname ? 'error' : ''}
                />
                {errors.fullname && <ErrorMessage>{errors.fullname}</ErrorMessage>}
              </Field>
              
              <Field>
                <Label>Номер телефона</Label>
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Разрешаем только цифры и +
                    if (/^[+\d]*$/.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  placeholder="Введите номер телефона"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </Field>

              {user.role === 'client' && (
                <Field>
                  <Label>Рост (см)</Label>
                  <Input
                    type="number"
                    placeholder="100-220 см"
                    value={height !== null ? height.toString() : ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                            setHeight(null);
                        } else {
                            const num = parseInt(value);
                            if (!isNaN(num)) {
                                setHeight(num);
                            }
                        }
                    }}
                    className={errors.height ? 'error' : ''}
                />
                {errors.height && <ErrorMessage>{errors.height}</ErrorMessage>}
                </Field>
              )}
              
              {user.role === 'trainer' && (
                <Field>
                  <Label>Специализация</Label>
                  <Input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Ваша специализация"
                  />
                </Field>
              )}
              
              <ProfileActions>
                <Button className="secondary" onClick={() => {
                  setIsEditing(false)
                  setHeight(null)
                }}>
                  Отмена
                </Button>
                <Button className="primary" onClick={handleSave}>
                  Сохранить
                </Button>
              </ProfileActions>
            </>
          ) : (
            <FieldRow>
              <Field>
                <Label>Имя пользователя</Label>
                <Value>{user.username}</Value>
              </Field>
              
              <Field>
                <Label>Email</Label>
                <Value>{user.email}</Value>
              </Field>
              
              <Field>
                <Label>ФИО</Label>
                <Value>{user.fullname || 'ФИО не указано'}</Value>
              </Field>
              
              <Field>
                <Label>Номер телефона</Label>
                <Value>{formatPhoneNumber(user.phone_number)}</Value>
              </Field>
              
              {user.role === 'client' && (
                <Field>
                  <Label>Тренер</Label>
                  <Value>{trainers.find((t) => t.id === user.trainer_id)?.fullname || trainers.find((t) => t.id === user.trainer_id)?.username || 'Не выбран'}</Value>
                </Field>
              )}
              
              {user.role === 'trainer' && (
                <Field>
                  <Label>Специализация</Label>
                  <Value>{user.specialization || 'Не указана'}</Value>
                </Field>
              )}

            {user.role === 'client' ? (
                <Field>
                    <Label>Рост</Label>
                    <Value>{height ? `${height} см` : 'Вы пока не добавляли рост'}</Value>
                </Field>
            ) : (
                <Field>
                    <Label>Дата регистрации</Label>
                    <Value>
                        {new Date(user.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </Value>
                </Field>
            )}
            </FieldRow>
          )}

          {!isEditing && (
            <FieldRow>
              <Field>
              <ProfileActions>
                <Button className="primary" style={{width: '100%'}} onClick={() => setIsEditing(true)}>
                  Редактировать профиль
                </Button>
              </ProfileActions>
              </Field>
            </FieldRow>
          )}
        </ProfileSection>
      </ScrollReveal>

      {user?.role === 'client' && (
  <ScrollReveal delay={0.4}>
    <ProfileSection>
      <SectionTitle>Программа тренировок</SectionTitle>
      
      {assignedProgram ? (
        <>
          <Link to={`/programs/${assignedProgram.program_id}`} style={{ textDecoration: 'none' }}>
            <ProgramCard>
              <ProgramTitle>{assignedProgram.program_name}</ProgramTitle>
              {assignedProgram.program_description && (
                <ProgramMeta>{assignedProgram.program_description}</ProgramMeta>
              )}
              <ProgramMeta>Назначена: {new Date(assignedProgram.assigned_at).toLocaleDateString('ru-RU')}</ProgramMeta>
            </ProgramCard>
          </Link>
          
          <Button 
            className="danger" 
            onClick={() => setIsUnassignModalOpen(true)}
            style={{ marginTop: '15px', fontSize: '0.9rem', width: '100%'}}
          >
            Прекратить заниматься по этой программе
          </Button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Пока что нет назначенной программы тренировок
        </div>
      )}
          </ProfileSection>
        </ScrollReveal>
      )}

<ModalOverlay $isOpen={isUnassignModalOpen}>
  <ModalContent>
    <ModalClose onClick={() => setIsUnassignModalOpen(false)}>×</ModalClose>
    <ModalTitle>Подтверждение</ModalTitle>
    <p>Вы действительно хотите прекратить заниматься по данной программе тренировок? Назначить программу тренировок может только ваш тренер.</p>
    
    <ModalActions style={{gap: '0.5rem'}}>
      <Button className="secondary" onClick={() => setIsUnassignModalOpen(false)} style={{fontSize: '0.8rem'}}>
        Отмена
      </Button>
      <Button className="danger" onClick={handleUnassignProgram} style={{fontSize: '0.8rem'}}>
        Да, согласен
      </Button>
    </ModalActions>
  </ModalContent>
</ModalOverlay>

      {/* Для клиентов - секция метрик */}
      <ScrollReveal delay={0.2}>
        {user.role === 'client' && (
          <MetricsSection>
            <SectionTitle>
              Мои метрики
              <AddMetricButton 
                className="primary" 
                onClick={() => setIsModalOpen(true)}
              >
                Добавить метрики
              </AddMetricButton>
            </SectionTitle>
            
            {currentMetrics.length > 0 ? (
              <>
                <ScrollReveal delay={0.05} key={currentPage}>
                  <MetricsGrid>
                    {currentMetrics.map((metric) => (
                      <MetricCard key={metric.id}>
                        <MetricDate style={{fontWeight: 'bold'}}>
                          {new Date(metric.date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </MetricDate>
                        <MetricValues>
                          <MetricValue>
                            <MetricLabel>Рост</MetricLabel>
                            <MetricNumber>{metric.height} см</MetricNumber>
                          </MetricValue>
                          <MetricValue>
                            <MetricLabel>Вес</MetricLabel>
                            <MetricNumber>{metric.weight} кг</MetricNumber>
                          </MetricValue>
                        </MetricValues>
                      </MetricCard>
                    ))}
                  </MetricsGrid>
                </ScrollReveal>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PageButton 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      ←
                    </PageButton>
                    
                    {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PageButton
                          key={pageNum}
                          disabled={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PageButton>
                      );
                    })}
                    
                    <PageButton 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      →
                    </PageButton>
                  </Pagination>
                )}
              </>
            ) : (
              <NoMetrics>Вы пока не добавляли метрики!</NoMetrics>
            )}
          </MetricsSection>
        )}
      </ScrollReveal>
      
      {/* Общая информация */}
      {/* <ProfileSection>
        <SectionTitle>Общая информация</SectionTitle>
        <FieldRow>
          <Field>
            <Label>Дата регистрации</Label>
            <Value>
              {new Date(user.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Value>
          </Field>
          
          <Field>
            <Label>Роль</Label>
            <Value>{user.role === 'client' ? 'Клиент' : 'Тренер'}</Value>
          </Field>
        </FieldRow>
      </ProfileSection> */}
    </ProfileContainer>
  );
};

export default ProfilePage;