/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #05396B;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }
  
  &::placeholder {
    color: #999;
  }

  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px;
  }
`;

const Select = styled.select`
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  
  &:focus {
    border-color: #5CDB94;
    background-color: white;
    outline: none;
    box-shadow: 0 0 0 3px rgba(92, 219, 148, 0.2);
  }

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #05396B;
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #A80003;
  }
`;

const WorkoutInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.p`
  margin: 0.5rem 0;
  color: #05396B;
`;

const ExercisesList = styled.div`
  margin: 1.5rem 0;
`;

const ExerciseItem = styled.div`
  padding: 1rem;
  border: 1px solid #e0e9ff;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #05396B;
`;

const ExerciseDetail = styled.p`
  margin: 0.25rem 0;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  
  &:first-child {
    background-color: #058E3A;
    color: white;
    
    &:hover {
      background-color: #046b2d;
    }
  }
  
  &:last-child {
    background-color: #A80003;
    color: white;
    
    &:hover {
      background-color: #930204;
    }
  }
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #05396B;
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #042a4d;
  }
`;

const ExerciseInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

interface WorkoutDetailsModalProps {
  workout: any;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({ 
  workout, 
  onClose, 
  onComplete,
  onSkip
}) => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [feeling, setFeeling] = useState(workout.feeling || '');
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);

  // useEffect(() => {
  //   const fetchExercises = async () => {
  //     try {
  //       const response = await api.get(`/workouts/${workout.id}/exercises`);
  //       setExercises(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  
  //   fetchExercises();
  // }, [workout.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exercisesResponse, allExercisesResponse] = await Promise.all([
          api.get(`/workouts/${workout.id}/exercises`),
          api.get('/exercises')
        ]);
        setExercises(exercisesResponse.data);
        setAvailableExercises(allExercisesResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [workout.id]);

  const handleCompleteWorkout = async () => {
    try {
      // 1. Сначала обновляем упражнения, если было редактирование
      if (editing) {
        // Получаем текущие упражнения из базы
        const currentExercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
        const currentExercises = currentExercisesResponse.data;
  
        // Создаем карту текущих упражнений для быстрого доступа
        const currentExercisesMap = new Map(currentExercises.map((ex: any) => [ex.id, ex]));
  
        // Обрабатываем каждое упражнение из формы
        for (const exercise of exercises) {
          if (exercise.id) {
            // Обновляем существующее упражнение
            await api.put(`/workouts/exercises/${exercise.id}`, {
              sets: Number(exercise.sets) || null,
              reps: Number(exercise.reps) || null,
              weight: Number(exercise.weight) || null,
              duration: Number(exercise.duration) || null,
              distance: Number(exercise.distance) || null
            });
            // Удаляем из карты, чтобы потом оставить только те, что нужно удалить
            currentExercisesMap.delete(exercise.id);
          } else {
            // Добавляем новое упражнение
            await api.post('/workouts/exercises', {
              workout_id: workout.id,
              exercise_id: exercise.exercise_id,
              sets: Number(exercise.sets) || null,
              reps: Number(exercise.reps) || null,
              weight: Number(exercise.weight) || null,
              duration: Number(exercise.duration) || null,
              distance: Number(exercise.distance) || null
            });
          }
        }
  
        // Удаляем упражнения, которые остались в карте (были удалены в форме)
        for (const id of currentExercisesMap.keys()) {
          await api.delete(`/workouts/exercises/${id}`);
        }
      }
  
      // 2. Обновляем статус тренировки и ощущения
      await api.put(`/workouts/${workout.id}/status`, {
        status: 'completed',
        feeling: feeling
      });
  
      // 3. Обновляем данные в родительском компоненте
      onComplete();
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      // setError('Не удалось сохранить изменения');
      // setTimeout(() => setError(''), 5000);
    }
  };
  
  const handleSkipWorkout = async () => {
    try {
      await api.put(`/workouts/${workout.id}/status`, { status: 'skipped' });
      onSkip();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, {
      exercise_id: '',
      name: '',
      category: '',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      distance: ''
    }]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{workout.name}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <WorkoutInfo>
          <InfoItem><strong>Дата:</strong> {new Date(workout.date).toLocaleDateString('ru-RU')}</InfoItem>
          <InfoItem><strong>Тип:</strong> {workout.type}</InfoItem>
          {workout.description && <InfoItem><strong>Описание:</strong> {workout.description}</InfoItem>}
        </WorkoutInfo>

        {workout.status === 'pending' && (
          <div style={{ marginBottom: '1rem' }}>
            <Label>Ощущения после тренировки:</Label>
            <Input 
              type="text" 
              value={feeling} 
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="Опишите ваши ощущения после тренировки"
            />
          </div>
        )}

        <ExercisesList>
          <h3>Упражнения:</h3>
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <ExerciseItem key={exercise.id || index}>
                {editing ? (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <Select
                        value={exercise.exercise_id}
                        onChange={(e) => {
                          const selectedEx = availableExercises.find(ex => ex.id === parseInt(e.target.value));
                          handleExerciseChange(index, 'exercise_id', e.target.value);
                          if (selectedEx) {
                            handleExerciseChange(index, 'name', selectedEx.name);
                            handleExerciseChange(index, 'category', selectedEx.category);
                          }
                        }}
                      >
                        <option value="">Выберите упражнение</option>
                        {availableExercises.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                        ))}
                      </Select>
                    </div>
                    
                    {exercise.category === 'Бег' ? (
                      <>
                        <ExerciseInput
                            type="number"
                            placeholder="Продолжительность (мин)"
                            value={exercise.duration}
                            onChange={(e) => {
                              const value = e.target.value; // Сохраняем сырое значение
                              handleExerciseChange(index, 'duration', value); // Передаем значение без изменений
                            }}
                            onBlur={(e) => {
                              // Ограничиваем значение только при потере фокуса
                              let value = parseFloat(e.target.value) || 0;
                              value = Math.min(Math.max(value, 1), 200); // Применяем ограничения
                              handleExerciseChange(index, 'duration', value.toString());
                            }}
                        />
                        <ExerciseInput
                            type="number"
                            placeholder="Дистанция (км)"
                            value={exercise.distance}
                            onChange={(e) => {
                              const value = e.target.value; // Сохраняем сырое значение
                              handleExerciseChange(index, 'distance', value); // Передаем значение без изменений
                            }}
                            onBlur={(e) => {
                              // Ограничиваем значение только при потере фокуса
                              let value = parseFloat(e.target.value) || 0;
                              value = Math.min(Math.max(value, 0.1), 42); // Применяем ограничения
                              handleExerciseChange(index, 'distance', value.toString());
                            }}
                            step="0.1"
                        />
                      </>
                    ) : (
                      <>
                        <ExerciseInput
                            type="number"
                            placeholder="Подходы"
                            value={exercise.sets}
                            onChange={(e) => {
                              const value = e.target.value; // Получаем сырое значение из инпута
                              handleExerciseChange(index, 'sets', value); // Сохраняем его как есть
                            }}
                            onBlur={(e) => {
                              // Ограничиваем значение только после того, как пользователь завершил ввод
                              let value = parseInt(e.target.value) || 0;
                              value = Math.min(Math.max(value, 1), 200); // Применяем ограничения
                              handleExerciseChange(index, 'sets', value.toString());
                            }}
                        />
                        <ExerciseInput
                            type="number"
                            placeholder="Повторения"
                            value={exercise.reps}
                            onChange={(e) => {
                              const value = e.target.value; // Сохраняем сырое значение
                              handleExerciseChange(index, 'reps', value); // Передаем значение без изменений
                            }}
                            onBlur={(e) => {
                              // Ограничиваем значение только при потере фокуса
                              let value = parseFloat(e.target.value) || 0;
                              value = Math.min(Math.max(value, 1), 200); // Применяем ограничения
                              handleExerciseChange(index, 'reps', value.toString());
                            }}
                        />
                        <ExerciseInput
                            type="number"
                            placeholder="Вес (кг)"
                            value={exercise.weight}
                            onChange={(e) => {
                              const value = e.target.value; // Сохраняем сырое значение
                              handleExerciseChange(index, 'weight', value); // Передаем значение без изменений
                            }}
                            onBlur={(e) => {
                              // Ограничиваем значение только при потере фокуса
                              let value = parseFloat(e.target.value) || 0;
                              value = Math.min(Math.max(value, 1), 200); // Применяем ограничения
                              handleExerciseChange(index, 'weight', value.toString());
                            }}
                        />
                      </>
                    )}
                    
                    <Button 
                      onClick={() => handleRemoveExercise(index)}
                      style={{ 
                        marginTop: '0.5rem',  
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Удалить упражнение
                    </Button>
                  </>
                ) : (
                  <>
                    <ExerciseName>{exercise.name} ({exercise.category})</ExerciseName>
                    {exercise.category === 'Бег' ? (
                      <>
                        <ExerciseDetail>Продолжительность: {exercise.duration} мин</ExerciseDetail>
                        <ExerciseDetail>Дистанция: {exercise.distance} км</ExerciseDetail>
                      </>
                    ) : (
                      <>
                        <ExerciseDetail>Подходы: {exercise.sets}</ExerciseDetail>
                        <ExerciseDetail>Повторения: {exercise.reps}</ExerciseDetail>
                        {exercise.weight > 0 && <ExerciseDetail>Вес: {exercise.weight} кг</ExerciseDetail>}
                      </>
                    )}
                  </>
                )}
              </ExerciseItem>
            ))
          ) : (
            <p>Нет упражнений</p>
          )}

          {editing && (
            <button 
              onClick={handleAddExercise}
              style={{ 
                margin: '1rem 0', 
                padding: '0.5rem 1rem',
                background: '#05396B',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Добавить упражнение
            </button>
          )}
        </ExercisesList>

        {workout.status === 'pending' && (
          <EditButton onClick={() => setEditing(!editing)} style={{width: '100%'}}>
            {editing ? 'Завершить редактирование' : 'Редактировать тренировку'}
          </EditButton>
        )}

        {/* disabled={editing ? true : false} style={{backgroundColor: editing ? '#666' : '#058E3A'}}
        disabled={editing ? true : false} style={{backgroundColor: editing ? '#666' : '#A80003'}} */}

        {workout.status === 'pending' && (
          <ButtonGroup style={{display: 'flex', flexWrap: 'wrap'}}>
            {editing !== true ? (
              <>
                <Button onClick={handleCompleteWorkout} style={{minWidth: "200px", flex: "1 1 200px"}}>
                  Тренировка выполнена
                </Button>
                <Button onClick={handleSkipWorkout} style={{minWidth: "200px", flex: "1 1 200px"}}>
                  Тренировка не выполнена
                </Button>
              </>
            ) : null}
          </ButtonGroup>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default WorkoutDetailsModal;