/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
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
  padding: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 500px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.4rem;
  }
`;

const Form = styled.form`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #05396B;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px) {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #05396B;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px) {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
`;

const TextArea = styled.textarea`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  color: #05396B;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px) {
    padding: 12px 15px;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  padding: 15px 25px;
  background-color: ${props => props.color === 'danger' ? '#A80003' : 
    props.color === 'secondary' ? '#5CDB94' : '#44719b'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.color === 'danger' ? '#930204' : 
      props.color === 'secondary' ? '#058E3A' : '#0056b3'};
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const PublicButton = styled.button<{ isPublic: boolean }>`
  padding: 15px;
  background-color: ${props => props.isPublic ? '#058E3A' : '#6c757d'};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background-color: ${props => props.isPublic ? '#058E3A' : '#5a6268'};
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const PrivateButton = styled.button<{ isPublic: boolean }>`
  padding: 15px;
  background-color: ${props => !props.isPublic ? '#dc3545' : '#6c757d'};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background-color: ${props => !props.isPublic ? '#c82333' : '#5a6268'};
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const WorkoutListContainer = styled.div`
  margin-top: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
`;

const WorkoutItem = styled.div`
  padding: 20px;
  border: 1px solid #e0e9ff;
  border-radius: 15px;
  margin-bottom: 15px;
  background-color: #f5f9ff;
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
`;

const WorkoutDetails = styled.div`
  margin-bottom: 15px;
  color: #666;
`;

const ExerciseList = styled.div`
  margin-top: 15px;
`;

const ExerciseItem = styled.div`
  padding: 15px;
  border: 1px solid #e0e9ff;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: white;
`;

const SectionTitle = styled.h3`
  color: #05396B;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const Notification = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  background-color: #dc3545;
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '-20px'});
  pointer-events: none;
`;

const ExistingWorkoutsContainer = styled.div`
  margin-top: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
`;

const ExistingWorkoutCard = styled.div`
  position: relative;
  padding: 15px;
  border: 1px solid #e0e9ff;
  border-radius: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f5f9ff;
  
  &:hover {
    background-color: rgba(0, 35, 99, 0.1);
  }
`;

const HoverOverlay = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  z-index: 1;
  
  ${ExistingWorkoutCard}:hover & {
    display: flex;
  }
`;

const ModalContent = styled.div`
  padding: 30px;
  background: white;
  border-radius: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  color: #05396B;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-right: 40px;
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

const ExerciseFormContainer = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: #f5f9ff;
  border: 1px solid #e0e9ff;
  margin-bottom: 20px;
`;

const ExerciseInputs = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ErrorMessage = styled.div`
  color: #A80003;
  background-color: rgba(168, 0, 3, 0.1);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ErrorField = styled.div<{ hasError: boolean }>`
  input, select, textarea {
    border-color: ${props => props.hasError ? '#A80003' : '#e0e0e0'};
    background-color: ${props => props.hasError ? 'rgba(168, 0, 3, 0.05)' : '#f9f9f9'};
    width: 100%;
  }

  padding: 5px 0;
`;

Modal.setAppElement('#root');

const CreateProgram: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Оздоровление');
  const [daysCount, setDaysCount] = useState(7);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [availableWorkouts, setAvailableWorkouts] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState<number | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    message: string;
    field: string;
    show: boolean;
  }>({
    message: '',
    field: '',
    show: false
  });

  const [modalErrors, setModalErrors] = useState<{
    message: string;
    field: string;
    show: boolean;
  }>({
    message: '',
    field: '',
    show: false
  });

  const showError = (message: string, field: string = '') => {
    setErrors({
      message,
      field,
      show: true
    });
    setTimeout(() => {
      setErrors({
        message: '',
        field: '',
        show: false
      });
    }, 5000);
  };

  const showModalError = (message: string, field: string = '') => {
    setModalErrors({
      message,
      field,
      show: true
    });
    setTimeout(() => {
      setModalErrors({
        message: '',
        field: '',
        show: false
      });
    }, 5000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workoutsResponse = await api.get('/workouts');
        setAvailableWorkouts(workoutsResponse.data);

        const exercisesResponse = await api.get('/exercises');
        setAvailableExercises(exercisesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation()
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      showError('Пожалуйста, укажите название программы', 'name');
      return;
    }

    // Валидация количества тренировок
    if (workouts.length === 0) {
      showError('Добавьте хотя бы одну тренировку');
      return;
    }

    // Валидация всех тренировок
    for (const workout of workouts) {
      if (!workout.name || !workout.name.trim()) {
        showNotification('Все тренировки должны иметь название');
        return;
      }

      if (!workout.exercises || workout.exercises.length === 0) {
        showNotification(`Тренировка "${workout.name}" не содержит упражнений`);
        return;
      }

      for (const exercise of workout.exercises) {
        if (!exercise.exerciseId) {
          showNotification(`В тренировке "${workout.name}" не выбрано упражнение`);
          return;
        }

        const selectedExercise = availableExercises.find(ex => ex.id === exercise.exerciseId);
        if (selectedExercise?.category === 'Бег') {
          if (!exercise.duration || !exercise.distance) {
            showNotification(`В тренировке "${workout.name}" заполните все поля для беговых упражнений`);
            return;
          }
        } else {
          if (!exercise.sets || !exercise.reps) {
            showNotification(`В тренировке "${workout.name}" заполните все поля для силовых упражнений`);
            return;
          }
        }
      }
    }

    try {
      await api.post('/programs', {
        name: trimmedName,
        type,
        days_count: daysCount,
        workouts_count: workouts.length,
        description: description.trim(),
        is_public: isPublic,
        workouts: workouts.map(workout => ({
          ...workout,
          name: workout.name.trim(),
          description: workout.description?.trim() || '',
          exercises: workout.exercises.map((ex: any) => ({
            ...ex,
            sets: Number(ex.sets) || 0,
            reps: Number(ex.reps) || 0,
            weight: Number(ex.weight) || 0,
            duration: Number(ex.duration) || 0,
            distance: Number(ex.distance) || 0
          }))
        }))
      });
      navigate('/programs');
    } catch (error) {
      console.error(error);
      showNotification('Не удалось создать программу. Пожалуйста, попробуйте снова.');
    }
  };

  const addCustomWorkout = () => {
    setCurrentWorkout({
      isCustom: true,
      name: '',
      description: '',
      type: 'Оздоровление',
      duration: 30,
      exercises: []
    });
    setCurrentWorkoutIndex(null);
    setIsEditingWorkout(true);
    setModalIsOpen(true);
  };

  const addExistingWorkout = async (workoutId: number) => {
    try {
      const response = await api.get(`/workouts/${workoutId}/exercises`);
      const workout = availableWorkouts.find(w => w.id === workoutId);
      
      if (workout) {
        const exercises = response.data.map((ex: any) => ({
          exerciseId: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          distance: ex.distance,
          type: ex.type
        }));

        setCurrentWorkout({
          ...workout,
          isCustom: true,
          exercises: exercises
        });
        setCurrentWorkoutIndex(null);
        setIsEditingWorkout(true);
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error(error);
      showNotification('Не удалось загрузить тренировку');
    }
  };

  const saveWorkout = () => {
    // Валидация названия тренировки
    const trimmedName = currentWorkout.name.trim();
    if (!trimmedName) {
      showModalError('Пожалуйста, укажите название тренировки', 'workoutName');
      return;
    }

    // Валидация типа тренировки
    if (!currentWorkout.type) {
      showModalError('Пожалуйста, выберите тип тренировки', 'workoutType');
      return;
    }

    // Валидация продолжительности
    const duration = Number(currentWorkout.duration);
    if (isNaN(duration)) {
      showModalError('Пожалуйста, укажите продолжительность тренировки', 'workoutDuration');
      return;
    }
    if (duration < 1 || duration > 180) {
      showModalError('Продолжительность тренировки должна быть от 1 до 180 минут', 'workoutDuration');
      return;
    }

    // Валидация упражнений
    if (currentWorkout.exercises.length === 0) {
      showModalError('Добавьте хотя бы одно упражнение');
      return;
    }

    for (const [index, exercise] of currentWorkout.exercises.entries()) {
      if (!exercise.exerciseId) {
        showModalError(`Выберите упражнение для пункта ${index + 1}`, `exercise-${index}-select`);
        return;
      }

      const selectedExercise = availableExercises.find(ex => ex.id === exercise.exerciseId);
      if (selectedExercise?.category === 'Бег') {
        if (
          !exercise.duration || exercise.duration < 1 || exercise.duration > 180 ||
          !exercise.distance || exercise.distance < 0.1 || exercise.distance > 42
        ) {
          showModalError(`Заполните корректно поля для бегового упражнения (${index + 1})`, `exercise-${index}-running`);
          return;
        }        
      } else {
        if (
          !exercise.sets || exercise.sets < 1 || exercise.sets > 100 ||
          !exercise.reps || exercise.reps < 1 || exercise.reps > 200
        ) {
          showModalError(`Заполните корректно поля для силового упражнения (${index + 1})`, `exercise-${index}-strength`);
          return;
        }
      }
    }

    const updatedWorkout = {
      ...currentWorkout,
      name: trimmedName,
      duration: duration,
      description: currentWorkout.description?.trim() || ''
    };

    if (currentWorkoutIndex !== null) {
      const newWorkouts = [...workouts];
      newWorkouts[currentWorkoutIndex] = updatedWorkout;
      setWorkouts(newWorkouts);
    } else {
      setWorkouts([...workouts, updatedWorkout]);
    }
    setModalIsOpen(false);
  };

  const editWorkout = (index: number) => {
    setCurrentWorkout({...workouts[index]});
    setCurrentWorkoutIndex(index);
    setIsEditingWorkout(true);
    setModalIsOpen(true);
  };

  const removeWorkout = (index: number) => {
    const newWorkouts = [...workouts];
    newWorkouts.splice(index, 1);
    setWorkouts(newWorkouts);
  };

  const handleExerciseChange = (exercise: any, exerciseIndex: number) => {
    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex] = exercise;
    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  const addExercise = () => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: [
        ...currentWorkout.exercises,
        {
          exerciseId: '',
          sets: '',
          reps: '',
          weight: '',
          duration: '',
          distance: ''
        }
      ]
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises.splice(exerciseIndex, 1);
    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  return (
    <Container>
      <ScrollReveal>
        <Title>Создать программу тренировок</Title>
      </ScrollReveal>

      <Form onSubmit={handleSubmit} noValidate>

      <ErrorField hasError={errors.field === 'name'}>
          <Input
            type="text"
            placeholder="Название программы*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            onInvalid={(e) => e.preventDefault()}
            style={{width: '100%'}}
          />
        </ErrorField>

        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="Похудение">Похудение</option>
          <option value="Оздоровление">Оздоровление</option>
          <option value="Сила">Сила</option>
          <option value="Выносливость">Выносливость</option>
          <option value="Укрепление мышечного корсета">Укрепление мышечного корсета</option>
          <option value="Комбинированная">Комбинированная</option>
        </Select>

        <Select
          value={daysCount}
          onChange={(e) => setDaysCount(Number(e.target.value))}
          required
        >
          <option value="7">7 дней</option>
          <option value="30">30 дней</option>
          <option value="90">90 дней</option>
        </Select>

        <TextArea
          placeholder="Описание программы (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />

        <ButtonGroup>
          <PublicButton 
            type="button" 
            isPublic={isPublic}
            onClick={() => setIsPublic(true)}
          >
            Общедоступная
          </PublicButton>
          <PrivateButton 
            type="button" 
            isPublic={isPublic}
            onClick={() => setIsPublic(false)}
          >
            Приватная
          </PrivateButton>
        </ButtonGroup>

        <SectionTitle>Тренировки ({workouts.length})</SectionTitle>

        <ExistingWorkoutsContainer style={{marginTop: '-25px'}}>
          <h4>Тренировки, созданные вами ранее:</h4>
          {availableWorkouts.map(workout => (
            <ExistingWorkoutCard 
              key={workout.id} 
              onClick={() => addExistingWorkout(workout.id)}
            >
              <HoverOverlay>Добавить эту тренировку</HoverOverlay>
              <h5>{workout.name || `Тренировка #${workout.id}`}</h5>
              <p>Тип: {workout.type}</p>
              <p>Длительность: {workout.duration} мин.</p>
            </ExistingWorkoutCard>
          ))}
        </ExistingWorkoutsContainer>

        <Button 
          type="button" 
          onClick={addCustomWorkout}
          color="secondary"
        >
          Добавить тренировку вручную
        </Button>

        <WorkoutListContainer>
          {workouts.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>
              Вы пока не добавили ни одной тренировки
            </p>
          ) : (
            workouts.map((workout, index) => (
              <WorkoutItem key={index}>
                <WorkoutHeader>
                  <h4>{workout.name || `Тренировка #${index + 1}`}</h4>
                  <ButtonGroup>
                    <Button 
                      type="button" 
                      onClick={() => editWorkout(index)}
                    >
                      Редактировать
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => removeWorkout(index)}
                      color="danger"
                    >
                      Удалить
                    </Button>
                  </ButtonGroup>
                </WorkoutHeader>
                <WorkoutDetails>
                  <p>Тип: {workout.type}</p>
                  <p>Продолжительность: {workout.duration} мин.</p>
                  {workout.description && <p>Описание: {workout.description}</p>}
                </WorkoutDetails>
                <div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setWorkouts(prevWorkouts => 
                        prevWorkouts.map((w, i) => 
                          i === index ? {...w, showExercises: !w.showExercises} : w
                        )
                      );
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: '#05396B',
                      fontWeight: 'bold'
                    }}
                  >
                    Упражнения: {workout.exercises.length} {workout.showExercises ? '▲' : '▼'}
                  </button>
                </div>
                {workout.showExercises && (
                  <ExerciseList>
                    {workout.exercises.map((exercise: any, exIndex: number) => {
                      const ex = availableExercises.find(e => e.id === exercise.exercise_id || e.id === exercise.exerciseId);
                      console.log(exercise)
                      return (
                        <ExerciseItem key={exIndex}>
                          <p><strong>{ex?.name || 'Неизвестное упражнение'}</strong> ({ex?.category || 'нет категории'})</p>
                          {ex?.category === 'Бег' ? (
                            <>
                              <p>Продолжительность бега: {exercise.duration} мин.</p>
                              <p>Дистанция: {exercise.distance} км</p>
                              <p>Средняя скорость: {(exercise.distance / (exercise.duration / 60)).toFixed(2)} км/ч</p>
                            </>
                          ) : (
                            <>
                              <p>Подходы: {exercise.sets}</p>
                              <p>Повторения: {exercise.reps}</p>
                              {exercise.weight > 0 && <p>Вес: {exercise.weight} кг</p>}
                            </>
                          )}
                        </ExerciseItem>
                      );
                    })}
                  </ExerciseList>
                )}
              </WorkoutItem>
            ))
          )}
        </WorkoutListContainer>
        {errors.show && (
          <ErrorMessage>{errors.message}</ErrorMessage>
        )}
        <Button type="submit" style={{backgroundColor: '#05396B'}}>Создать программу тренировок</Button>
      </Form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Workout Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          },
          content: {
            position: 'relative',
            inset: 'auto',
            border: 'none',
            background: 'none',
            overflow: 'hidden',
            width: '90%',
            maxWidth: '800px',
            padding: 0
          }
        }}
      >
        <ModalContent>
          {currentWorkout && (
            <>
              <CloseButton onClick={() => setModalIsOpen(false)}>×</CloseButton>
              <ModalTitle>
                {isEditingWorkout ? 'Редактировать тренировку' : 'Добавить тренировку'}
              </ModalTitle>

              <ErrorField hasError={modalErrors.field === 'workoutName'}>
                <Input
                  type="text"
                  placeholder="Название тренировки*"
                  value={currentWorkout.name}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    name: e.target.value
                  })}
                  required
                  style={{width: '100%'}}
                />
              </ErrorField>

              <ErrorField hasError={modalErrors.field === 'workoutType'}>
                <Select
                  value={currentWorkout.type}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    type: e.target.value
                  })}
                  required
                >
                  <option value="" disabled>Выберите тип*</option>
                  <option value="Похудение">Похудение</option>
                  <option value="Оздоровление">Оздоровление</option>
                  <option value="Сила">Сила</option>
                  <option value="Выносливость">Выносливость</option>
                  <option value="Кардио">Кардио</option>
                </Select>
              </ErrorField>

              <ErrorField hasError={modalErrors.field === 'workoutDuration'}>
                <Input
                  type="number"
                  placeholder="Продолжительность (1-180 минут)*"
                  value={currentWorkout.duration || ''}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    duration: e.target.value
                  })}
                  min="1"
                  max="180"
                  required
                />
              </ErrorField>

              <TextArea
                placeholder="Описание (необязательно)"
                value={currentWorkout.description || ''}
                onChange={(e) => setCurrentWorkout({
                  ...currentWorkout,
                  description: e.target.value
                })}
                style={{width: '100%'}}
              />

              <SectionTitle>Упражнения</SectionTitle>
              
              {currentWorkout.exercises.map((exercise: any, index: number) => {
                const ex = availableExercises.find(e => e.id === exercise.exercise_id || e.id === exercise.exerciseId);
                return (
                <ExerciseFormContainer key={index}>
                    <Select
                      value={exercise.exerciseId}
                      onChange={(e) => {
                        const exId = e.target.value;
                        const selectedEx = availableExercises.find(ex => ex.id === exId);
                        handleExerciseChange({
                          ...exercise,
                          exerciseId: exId,
                          type: selectedEx?.type || 'strength',
                          // Сбрасываем значения при смене типа упражнения
                          ...(selectedEx?.category === 'Бег' 
                            ? { sets: '', reps: '', weight: '' }
                            : { duration: '', distance: '' })
                        }, index);
                      }}
                      required
                      style={{maxWidth: '100%'}}
                    >
                      <option value="" disabled>Выберите упражнение*</option>
                      {availableExercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.category})
                        </option>
                      ))}
                    </Select>

                  {exercise.exerciseId && (
                    <ExerciseInputs>
                    {ex?.category === 'Бег' ? (
                      <>
                        <Input
                          type="number"
                          placeholder="Продолжительность (мин)"
                          value={exercise.duration || ''}
                          onChange={(e) => handleExerciseChange({
                            ...exercise,
                            duration: e.target.value
                          }, index)}
                          min="1"
                          max="180"
                          required
                          style={{width: '100%'}}
                        />
                        <Input
                          type="number"
                          placeholder="Дистанция (км)*"
                          value={exercise.distance || ''}
                          onChange={(e) => handleExerciseChange({
                            ...exercise,
                            distance: e.target.value
                          }, index)}
                          step="0.1"
                          min="0.1"
                          required
                          style={{width: '100%'}}
                        />
                      </>
                    ) : (
                      <>
                        <Input
                          type="number"
                          placeholder="Подходы (1-100)*"
                          value={exercise.sets || ''}
                          onChange={(e) => handleExerciseChange({
                            ...exercise,
                            sets: Math.max(1, Math.min(100, Number(e.target.value)))
                          }, index)}
                          min="1"
                          max="100"
                          required
                          style={{width: '100%'}}
                        />
                        <Input
                          type="number"
                          placeholder="Повторения*"
                          value={exercise.reps || ''}
                          onChange={(e) => handleExerciseChange({
                            ...exercise,
                            reps: Math.max(1, Math.min(500, Number(e.target.value)))
                          }, index)}
                          min="1"
                          max="500"
                          required
                          style={{width: '100%'}}
                        />
                        <Input
                          type="number"
                          placeholder="Вес (кг)"
                          value={exercise.weight || ''}
                          onChange={(e) => handleExerciseChange({
                            ...exercise,
                            weight: Math.max(1, Math.min(1000, Number(e.target.value)))
                          }, index)}
                          min="0.5"
                          max="1000"
                          style={{width: '100%'}}
                        />
                      </>
                    )}
                  </ExerciseInputs>
                  )}
                  <Button 
                    type="button" 
                    onClick={() => removeExercise(index)}
                    color="danger"
                    style={{ marginTop: '10px' }}
                  >
                    Удалить упражнение
                  </Button>
                </ExerciseFormContainer>
                )
                }
              )}

              <Button 
                type="button" 
                onClick={addExercise}
                color="secondary"
              >
                Добавить упражнение
              </Button>
              {modalErrors.show && (
                <ErrorMessage style={{marginTop: '10px'}}>{modalErrors.message}</ErrorMessage>
              )}
              <ButtonGroup style={{ marginTop: '20px' }}>
                <Button 
                  type="button" 
                  onClick={saveWorkout}
                >
                  Сохранить тренировку
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setModalIsOpen(false)}
                  color="danger"
                >
                  Отмена
                </Button>
              </ButtonGroup>
            </>
          )}
        </ModalContent>
      </Modal>

      <Notification show={notification.show}>
        {notification.message}
      </Notification>
    </Container>
  );
};

export default CreateProgram;