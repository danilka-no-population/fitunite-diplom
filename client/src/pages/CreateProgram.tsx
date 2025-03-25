/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';
import ExerciseForm from '../components/ExerciseForm';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CustomButton = styled.button`
  padding: 10px;
  background-color:rgb(13, 153, 0);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgb(10, 105, 1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const PublicButton = styled.button<{ isPublic: boolean }>`
  padding: 10px;
  background-color: ${props => props.isPublic ? '#28a745' : '#6c757d'};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
`;

const PrivateButton = styled.button<{ isPublic: boolean }>`
  padding: 10px;
  background-color: ${props => !props.isPublic ? '#dc3545' : '#6c757d'};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
`;

const WorkoutList = styled.div`
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
`;

const WorkoutItem = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const WorkoutDetails = styled.div`
  margin-bottom: 10px;
`;

const ExerciseList = styled.div`
  margin-top: 10px;
`;

const ExerciseItem = styled.div`
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 5px;
`;

// const ErrorMessage = styled.div`
//   color: #dc3545;
//   margin-top: 5px;
// `;

const ModalContent = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

// Add this styled component near your other styled components
const Notification = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  background-color: #dc3545;
  color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateY(${props => props.show ? '0' : '-20px'});
  pointer-events: ${props => props.show ? 'all' : 'none'};
`;

const ExistingWorkoutsContainer = styled.div`
  margin-top: 15px;
`;

const ExistingWorkoutCard = styled.div`
  position: relative; /* Устанавливаем позиционирование для карточки */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden; /* Ограничиваем содержимое карточки */

  &:hover {
    background-color: rgba(0, 35, 99, 0.31); /* Полупрозрачный фон */
    color: rgba(255, 255, 255, 0.3);; /* Белый текст при наведении */
  }

  &:hover .hover-overlay {
    display: flex; /* Показываем текст при наведении */
  }
`;

const HoverOverlay = styled.div`
  display: none; /* Скрыто по умолчанию */
  position: absolute; /* Абсолютное позиционирование внутри карточки */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Темный полупрозрачный фон */
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  align-items: center; /* Центрирование текста */
  justify-content: center;
  border-radius: 5px; /* Совпадает с радиусом карточки */
  z-index: 1; /* Поверх содержимого карточки */
`;






Modal.setAppElement('#root');

const CreateProgram: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Оздоровление');
  const [daysCount, setDaysCount] = useState(7);
  const [workoutsCount, setWorkoutsCount] = useState(1);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [availableWorkouts, setAvailableWorkouts] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  // const [error, setError] = useState('');
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState<number | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  // Add this state near your other state declarations
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });

  // Add this function to show notifications
  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate workout count
    if (workouts.length !== workoutsCount) {
      showNotification(`У вас добавлено ${workouts.length} тренировок, но указано ${workoutsCount}`);
      return;
    }
  
    // Validate all workouts have names
    if (workouts.some(w => !w.name)) {
      showNotification('Все тренировки должны иметь название');
      return;
    }
  
    // Validate all workouts have exercises
    if (workouts.some(w => !w.exercises || w.exercises.length === 0)) {
      showNotification('Все тренировки должны содержать хотя бы одно упражнение');
      return;
    }
  
    // Validate and convert all numeric fields
    const validatedWorkouts = workouts.map(workout => ({
      ...workout,
      duration: workout.duration ? Number(workout.duration) : 0,
      exercises: workout.exercises.map((ex: any) => ({
        ...ex,
        exerciseId: Number(ex.exerciseId),
        sets: ex.sets ? Number(ex.sets) : 0,
        reps: ex.reps ? Number(ex.reps) : 0,
        weight: ex.weight ? Number(ex.weight) : 0,
        duration: ex.duration ? Number(ex.duration) : 0,
        distance: ex.distance ? Number(ex.distance) : 0
      }))
    }));
  
    // Validate all exercises have an exerciseId
    if (validatedWorkouts.some(w => w.exercises.some((ex: any) => !ex.exerciseId || isNaN(ex.exerciseId)))) {
      showNotification('Все упражнения должны быть выбраны из списка');
      return;
    }
  
    try {
      await api.post('/programs', {
        name,
        type,
        days_count: daysCount,
        workouts_count: workoutsCount,
        description,
        is_public: isPublic,
        workouts: validatedWorkouts
      });
      navigate('/programs');
    } catch (error) {
      console.error(error);
      showNotification('Не удалось создать программу. Пожалуйста, проверьте все поля и попробуйте снова.');
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Проверка количества тренировок
  //   if (workouts.length !== workoutsCount) {
  //     setError(`You added ${workouts.length} workouts, but specified ${workoutsCount}`);
  //     return;
  //   }

  //   // Проверка, что все тренировки имеют упражнения
  //   for (const workout of workouts) {
  //     if (!workout.exercises || workout.exercises.length === 0) {
  //       setError('All workouts must have at least one exercise');
  //       return;
  //     }
  //   }

  //   try {
  //     await api.post('/programs', {
  //       name,
  //       type,
  //       days_count: daysCount,
  //       workouts_count: workoutsCount,
  //       description,
  //       is_public: isPublic,
  //       workouts
  //     });
  //     navigate('/programs');
  //   } catch (error) {
  //     console.error(error);
  //     setError('Failed to create program');
  //   }
  // };

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
        // Преобразуем упражнения в нужный формат
        const exercises = response.data.map((ex: any) => ({
          exerciseId: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          duration: ex.duration,
          distance: ex.distance,
          type: ex.type // Добавляем тип упражнения
        }));

        setCurrentWorkout({
          ...workout,
          isCustom: true, // При добавлении существующей тренировки она становится кастомной
          exercises: exercises
        });
        setCurrentWorkoutIndex(null);
        setIsEditingWorkout(true);
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveWorkout = () => {
    // Validate workout name
    if (!currentWorkout.name) {
      showNotification('Пожалуйста, укажите название тренировки');
      return;
    }
  
    // Validate at least one exercise
    if (currentWorkout.exercises.length === 0) {
      showNotification('Тренировка должна содержать хотя бы одно упражнение');
      return;
    }
  
    // Validate all exercises have fields filled
    const hasEmptyFields = currentWorkout.exercises.some((ex: any) => {
      if (!ex.exerciseId) return true;
      
      const selectedEx = availableExercises.find(e => e.id === ex.exerciseId);
      if (selectedEx?.category === 'Бег') {
        return ex.duration === undefined || ex.duration === '' || 
               ex.distance === undefined || ex.distance === '';
      } else {
        return ex.sets === undefined || ex.sets === '' || 
               ex.reps === undefined || ex.reps === '';
      }
    });
  
    if (hasEmptyFields) {
      showNotification('Пожалуйста, заполните все поля для каждого упражнения');
      return;
    }
  
    if (currentWorkoutIndex !== null) {
      const newWorkouts = [...workouts];
      newWorkouts[currentWorkoutIndex] = currentWorkout;
      setWorkouts(newWorkouts);
    } else {
      setWorkouts([...workouts, currentWorkout]);
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
          exerciseId: '', // This should match your DB expectations
          sets: 0,       // Initialize as numbers, not strings
          reps: 0,
          weight: 0,
          duration: 0,
          distance: 0
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
      <h1 style={{paddingBottom: '10px'}}>Создать программу тренировок</h1>
      {/* {error && <ErrorMessage>{error}</ErrorMessage>} */}
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Название программы"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <Input
          type="number"
          placeholder="Кол-во тренировок"
          value={workoutsCount}
          onChange={(e) => setWorkoutsCount(Number(e.target.value))}
          min="1"
          max={daysCount * 2}
          required
        />

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

        <h3>Тренировки ({workouts.length}/{workoutsCount})</h3>

        {/* <Select
          onChange={(e) => addExistingWorkout(Number(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>Select Existing Workout</option>
          {availableWorkouts.map(workout => (
            <option key={workout.id} value={workout.id}>
              {workout.name || `Workout #${workout.id}`}
            </option>
          ))}
        </Select> */}
        <ExistingWorkoutsContainer>
          <h4>Тренировки, созданные вами ранее:</h4>
          {availableWorkouts.map(workout => (
            <ExistingWorkoutCard 
              key={workout.id} 
              onClick={() => addExistingWorkout(workout.id)}
            >
              <HoverOverlay className="hover-overlay">
                Добавить эту тренировку
              </HoverOverlay>
              <h5>{workout.name || `Workout #${workout.id}`}</h5>
              <p>Тип: {workout.type}</p>
              <p>Длительность тренировки: {workout.duration} мин.</p>
            </ExistingWorkoutCard>
          ))}
        </ExistingWorkoutsContainer>

        <CustomButton type="button" onClick={addCustomWorkout}>
          Добавить тренировку вручную
        </CustomButton>
        <h2 style={{marginTop: '20px'}}>Добавленные тренировки:</h2>
        {workouts.length === 0 && <h4 style={{color: 'blue'}}>Вы пока не добавили ни одной тренировки!</h4>}
        <WorkoutList>
        {workouts.map((workout, index) => (
          <WorkoutItem key={index}>
            <WorkoutHeader>
              <h4>{workout.name || `Workout #${index + 1}`}</h4>
              <div>
                <Button 
                  type="button" 
                  onClick={() => editWorkout(index)}
                  style={{ marginRight: '10px' }}
                >
                  Редактировать
                </Button>
                <Button 
                  type="button" 
                  onClick={() => removeWorkout(index)}
                  style={{ backgroundColor: '#dc3545' }}
                >
                  Удалить
                </Button>
              </div>
            </WorkoutHeader>
            <WorkoutDetails>
              <p>Тип: {workout.type}</p>
              <p>Продолжительность: {workout.duration} мин.</p>
              {workout.description && <p>Описание: {workout.description}</p>}
            </WorkoutDetails>
            <h5>
              <button 
                type="button" 
                onClick={() => {
                  setWorkouts(prevWorkouts => 
                    prevWorkouts.map((w, i) => 
                      i === index ? {...w, showExercises: !w.showExercises} : w
                    )
                  );
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Упражнения: {workout.exercises.length} {workout.showExercises ? '▲' : '▼'}
              </button>
            </h5>
            {workout.showExercises && (
              <ExerciseList>
                {workout.exercises.map((exercise: any, exIndex: number) => {
                  const ex = availableExercises.find(e => String(e.id) === String(exercise.exerciseId));
                  return (
                    <ExerciseItem key={exIndex}>
                      <p><strong>{ex?.name || 'Unknown exercise'}</strong> ({ex?.category})</p>
                      {ex.category === 'Бег' ? (
                        <>
                          <p>Продолжительность бега: {exercise.duration} мин.</p>
                          <p>Дистанция: {exercise.distance} км</p>
                          <p>Средняя скорость: {exercise.distance / (exercise.duration / 60)} км/ч</p>
                        </>
                      ) : (
                        <>
                          <p>Подходы: {exercise.sets}</p>
                          <p>Повторения: {exercise.reps}</p>
                          <p>С каким весом делать: {exercise.weight} кг</p>
                        </>
                      )}
                    </ExerciseItem>
                  );
                })}
              </ExerciseList>
            )}
          </WorkoutItem>
        ))}
      </WorkoutList>

        <Button type="submit">Создать программу тренировок</Button>
      </Form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Workout"
      >
        <ModalContent>
          {currentWorkout && (
            <>
              <h2>{isEditingWorkout ? 'Edit Workout' : 'Add Workout'}</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label>Название тренировки</label>
                <Input
                  type="text"
                  value={currentWorkout.name}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    name: e.target.value
                  })}
                  placeholder="Название тренировки"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Тип тренировки</label>
                <Select
                  value={currentWorkout.type}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    type: e.target.value
                  })}
                >
                  <option value="Похудение">Похудение</option>
                  <option value="Оздоровление">Оздоровление</option>
                  <option value="Сила">Сила</option>
                  <option value="Выносливость">Выносливость</option>
                  <option value="Кардио">Кардио</option>
                </Select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Продолжительность (в минутах)</label>
                <Input
                  type="number"
                  value={currentWorkout.duration}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    duration: e.target.value
                  })}
                  placeholder="Duration"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Описание (необязательно)</label>
                <TextArea
                  value={currentWorkout.description || ''}
                  onChange={(e) => setCurrentWorkout({
                    ...currentWorkout,
                    description: e.target.value
                  })}
                  placeholder="Описание"
                />
              </div>

              <h3>Упражнения</h3>
              {currentWorkout.exercises.map((exercise: any, index: number) => (
                <div key={index} style={{ marginBottom: '15px', border: '1px solid #eee', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <Select
                      value={exercise.exerciseId}
                      onChange={(e) => handleExerciseChange({
                        ...exercise,
                        exerciseId: e.target.value,
                        type: availableExercises.find(ex => ex.id === e.target.value)?.type || 'strength'
                      }, index)}
                      style={{ flex: 1, marginRight: '10px' }}
                    >
                      <option value="">Выберите упражнение</option>
                      {availableExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.category})
                        </option>
                      ))}
                    </Select>
                    <Button 
                      type="button" 
                      onClick={() => removeExercise(index)}
                      style={{ backgroundColor: '#dc3545' }}
                    >
                      Удалить
                    </Button>
                  </div>

                  {exercise.exerciseId && (
                    <ExerciseForm
                      exercise={exercise}
                      availableExercises={availableExercises}
                      onChange={(updatedExercise) => handleExerciseChange(updatedExercise, index)}
                    />
                  )}
                </div>
              ))}

              <Button 
                type="button" 
                onClick={addExercise}
                style={{ marginBottom: '20px' }}
              >
                Добавить упражнение
              </Button>

              <ButtonGroup>
                <Button type="button" onClick={saveWorkout}>
                  Сохранить тренировку
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setModalIsOpen(false)}
                  style={{ backgroundColor: '#6c757d' }}
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