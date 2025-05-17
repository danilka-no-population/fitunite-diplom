/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
// import { jwtDecode } from 'jwt-decode';

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
  max-width: 600px;
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

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e0e9ff;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: ${props => props.active ? '3px solid #058E3A' : 'none'};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : 'normal'};
  color: ${props => props.active ? '#05396B' : '#666'};
  
  &:hover {
    color: #05396B;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #05396B;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #5CDB94;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #5CDB94;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #046b2d;
  }
`;

const ProgramWorkoutsContainer = styled.div`
  margin-top: 1rem;
`;

const ProgramWorkoutCard = styled.div`
  padding: 1rem;
  border: 1px solid #e0e9ff;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f9ff;
  }
`;

const ErrorMessage = styled.div`
  color: #A80003;
  background-color: rgba(168, 0, 3, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const WorkoutInfo = styled.div`
  margin-top: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 25px;
`;

const InfoItem = styled.div`
  padding: 20px;
  border: 1px solid #e0e9ff;
  border-radius: 15px;
  margin-bottom: 15px;
  background-color: #f5f9ff;
`;

const ExercisesList = styled.div`
  margin-top: 15px;
`;

const ExerciseItem = styled.div`
  padding: 15px;
  border: 1px solid #e0e9ff;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: white;
`;

const ExerciseDetail = styled.div``
const ExerciseName = styled.h2``

interface AssignWorkoutModalProps {
  clientId: number;
  onClose: () => void;
  onWorkoutAssigned: () => void;
}

// client/src/components/AssignWorkoutModal.tsx
// [Previous imports remain the same...]

const AssignWorkoutModal: React.FC<AssignWorkoutModalProps> = ({ clientId, onClose, onWorkoutAssigned }) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'program'>('custom');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Оздоровление');
  const [date, setDate] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programWorkouts, setProgramWorkouts] = useState<any[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [editingExercises, setEditingExercises] = useState(false);

  const [previewWorkout, setPreviewWorkout] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handlePreviewWorkout = async (workout: any) => {
    try {
      // Загружаем упражнения для выбранной тренировки
      const exercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
      setPreviewWorkout({
        ...workout,
        exercises: exercisesResponse.data
      });
      setPreviewModalOpen(true);
    } catch (error) {
      console.error(error);
      setError('Не удалось загрузить упражнения');
      setTimeout(() => setError(''), 5000);
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get('/programs/my');
        setPrograms(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (activeTab === 'program') {
      fetchPrograms();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedProgram) {
      const fetchProgramWorkouts = async () => {
        try {
          const response = await api.get(`/programs/${selectedProgram.id}`);
          const workouts = response.data.workouts;
          
          // Для каждой тренировки загружаем упражнения
          const workoutsWithExercises = await Promise.all(
            workouts.map(async (workout: any) => {
              const exercisesResponse = await api.get(`/programs/workouts/${workout.id}/exercises`);
              return {
                ...workout,
                exercises: exercisesResponse.data
              };
            })
          );
          
          setProgramWorkouts(workoutsWithExercises);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchProgramWorkouts();
    }
  }, [selectedProgram]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setAvailableExercises(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExercises();
  }, []);

  const handleAddExercise = () => {
    setExercises([...exercises, {
      exerciseId: '',
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

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSelectWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    if (workout.exercises) {
      setExercises(workout.exercises.map((ex: any) => ({
        exerciseId: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        distance: ex.distance
      })));
    }
    setEditingExercises(false);
  };

  const validateExercise = (exercise: any) => {
    if (!exercise.exerciseId) return "Выберите упражнение";
    
    const selectedExercise = availableExercises.find(ex => ex.id === parseInt(exercise.exerciseId));
    if (selectedExercise?.category === 'Бег') {
      if (!exercise.duration || exercise.duration < 1 || exercise.duration > 200) 
        return "Продолжительность должна быть от 1 до 200 минут";
      if (!exercise.distance || exercise.distance < 0.1 || exercise.distance > 42) 
        return "Дистанция должна быть от 0.1 до 42 км";
    } else {
      if (!exercise.sets || exercise.sets < 1 || exercise.sets > 200) 
        return "Подходы должны быть от 1 до 200";
      if (!exercise.reps || exercise.reps < 1 || exercise.reps > 200) 
        return "Повторения должны быть от 1 до 200";
      if (exercise.weight && (exercise.weight < 1 || exercise.weight > 200)) 
        return "Вес должен быть от 1 до 200 кг";
    }
    return null;
  };

  const validateForm = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    
    if (!date) return "Укажите дату выполнения тренировки";
    if (selectedDate < today) return "Нельзя выбрать дату раньше сегодняшнего дня";
    
    if (activeTab === 'custom') {
      if (exercises.length === 0) return "Добавьте хотя бы одно упражнение";
      
      for (const exercise of exercises) {
        const error = validateExercise(exercise);
        if (error) return error;
      }
    } else {
      if (!selectedProgram) return "Выберите программу тренировок";
      if (!selectedWorkout) return "Выберите тренировку из программы";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(''), 5000);
      return;
    }
  
    setLoading(true);
    try {
      // Создаем тренировку
      const workoutResponse = await api.post('/workouts/assign', {
        client_id: clientId,
        name: activeTab === 'custom' ? name : selectedWorkout.name,
        description: activeTab === 'custom' ? description : selectedWorkout.description,
        type: activeTab === 'custom' ? type : selectedWorkout.type,
        date,
        duration: activeTab === 'custom' 
          ? exercises.reduce((sum, ex) => sum + (Number(ex.duration) || 0), 0) || 60
          : selectedWorkout.duration,
        status: 'pending'
      });
  
      // Определяем, какие упражнения нужно добавить
      const exercisesToAdd = activeTab === 'program' 
        ? selectedWorkout.exercises || exercises
        : exercises;
  
      // Добавляем упражнения
      await Promise.all(
        exercisesToAdd.map((exercise: any) => 
          api.post('/workouts/exercises', {
            workout_id: workoutResponse.data.id,
            exercise_id: exercise.exercise_id || exercise.exerciseId,
            sets: exercise.sets ? Number(exercise.sets) : null,
            reps: exercise.reps ? Number(exercise.reps) : null,
            weight: exercise.weight ? Number(exercise.weight) : null,
            duration: exercise.duration ? Number(exercise.duration) : null,
            distance: exercise.distance ? Number(exercise.distance) : null
          })
        )
      );
      
      onWorkoutAssigned();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Ошибка при назначении тренировки');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Назначить тренировку</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Tabs>
          <Tab active={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
            Создать вручную
          </Tab>
          <Tab active={activeTab === 'program'} onClick={() => setActiveTab('program')}>
            Из программы
          </Tab>
        </Tabs>

        {activeTab === 'custom' ? (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Название тренировки</Label>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </FormGroup>

            <FormGroup>
              <Label>Описание</Label>
              <Input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </FormGroup>

            <FormGroup>
              <Label>Тип тренировки</Label>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Оздоровление">Оздоровление</option>
                <option value="Похудение">Похудение</option>
                <option value="Сила">Сила</option>
                <option value="Выносливость">Выносливость</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Дата выполнения</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />
            </FormGroup>

            <div>
              <h3>Упражнения</h3>
              {exercises.map((exercise, index) => {
                const selectedExercise = availableExercises.find(ex => ex.id === parseInt(exercise.exerciseId));
                const isRunning = selectedExercise?.category === 'Бег';
                
                return (
                  <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                    <Select
                      value={exercise.exerciseId}
                      onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <option value="">Выберите упражнение</option>
                      {availableExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                      ))}
                    </Select>
                    
                    {exercise.exerciseId && (
                      isRunning ? (
                        <>
                          <Input
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
                            style={{ marginBottom: '0.5rem' }}
                          />

                          <Input
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
                          <Input
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
                            style={{ marginBottom: '0.5rem' }}
                          />
                          <Input
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
                            style={{ marginBottom: '0.5rem' }}
                          />

                          <Input
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
                      )
                    )}
                    
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExercise(index)}
                      style={{ marginTop: '0.5rem', color: 'red' }}
                    >
                      Удалить упражнение
                    </button>
                  </div>
                );
              })}
              
              <button 
                type="button" 
                onClick={handleAddExercise}
                style={{ margin: '1rem 0' }}
              >
                Добавить упражнение
              </button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Назначить тренировку'}
            </Button>
          </form>
        ) : (
          <div>
            <FormGroup>
              <Label>Выберите программу</Label>
              <Select 
                value={selectedProgram?.id || ''} 
                onChange={(e) => {
                  const program = programs.find(p => p.id === Number(e.target.value));
                  setSelectedProgram(program || null);
                  setSelectedWorkout(null);
                }}
              >
                <option value="">Выберите программу</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {selectedProgram && (
              <>
                <FormGroup>
                  <Label>Дата выполнения</Label>
                  <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Выберите тренировку</Label>
                  <ProgramWorkoutsContainer>
                    {programWorkouts.map(workout => (
                      <ProgramWorkoutCard 
                        key={workout.id} 
                        onClick={() => handleSelectWorkout(workout)}
                        style={{
                          backgroundColor: selectedWorkout?.id === workout.id ? '#f0f7ff' : 'white',
                          borderColor: selectedWorkout?.id === workout.id ? '#5CDB94' : '#e0e9ff'
                        }}
                      >
                        <h4>{workout.name}</h4>
                        <p>Тип: {workout.type}</p>
                        <p>Длительность: {workout.duration} мин</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewWorkout(workout);
                          }}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            background: '#05396B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Просмотреть
                        </button>
                      </ProgramWorkoutCard>
                    ))}
                  </ProgramWorkoutsContainer>
                </FormGroup>

                {selectedWorkout && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setEditingExercises(!editingExercises)}
                      style={{ 
                        margin: '1rem 0', 
                        padding: '0.5rem 1rem',
                        backgroundColor: editingExercises ? '#058E3A' : '#f0f0f0',
                        color: editingExercises ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      {editingExercises ? 'Завершить редактирование' : 'Редактировать упражнения'}
                    </button>

                    {editingExercises && (
                      <div>
                        <h3>Упражнения</h3>
                        {exercises.map((exercise, index) => {
                          const selectedExercise = availableExercises.find(ex => ex.id === parseInt(exercise.exerciseId));
                          const isRunning = selectedExercise?.category === 'Бег';
                          
                          return (
                            <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                              <Select
                                value={exercise.exerciseId}
                                onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
                                style={{ marginBottom: '0.5rem' }}
                              >
                                <option value="">Выберите упражнение</option>
                                {availableExercises.map(ex => (
                                  <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                                ))}
                              </Select>
                              
                              {exercise.exerciseId && (
                                isRunning ? (
                                  <>
                                    <Input
                                      type="number"
                                      placeholder="Продолжительность (мин)"
                                      value={exercise.duration}
                                      onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                                      style={{ marginBottom: '0.5rem' }}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Дистанция (км)"
                                      value={exercise.distance}
                                      onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
                                      step="0.1"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Input
                                      type="number"
                                      placeholder="Подходы"
                                      value={exercise.sets}
                                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                      style={{ marginBottom: '0.5rem' }}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Повторения"
                                      value={exercise.reps}
                                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                      style={{ marginBottom: '0.5rem' }}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Вес (кг)"
                                      value={exercise.weight}
                                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                    />
                                  </>
                                )
                              )}
                              
                              <button 
                                type="button" 
                                onClick={() => handleRemoveExercise(index)}
                                style={{ marginTop: '0.5rem', color: 'red' }}
                              >
                                Удалить упражнение
                              </button>
                            </div>
                          );
                        })}
                        
                        <button 
                          type="button" 
                          onClick={handleAddExercise}
                          style={{ margin: '1rem 0' }}
                        >
                          Добавить упражнение
                        </button>
                      </div>
                    )}
                  </>
                )}

                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={!selectedWorkout || !date || loading}
                >
                  {loading ? 'Сохранение...' : 'Назначить тренировку'}
                </Button>

                {previewModalOpen && previewWorkout && (
                  <ModalOverlay onClick={() => setPreviewModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                      <ModalHeader>
                        <ModalTitle>Просмотр тренировки</ModalTitle>
                        <CloseButton onClick={() => setPreviewModalOpen(false)}>×</CloseButton>
                      </ModalHeader>
                      
                      <WorkoutInfo>
                        <InfoItem><strong>Название:</strong> {previewWorkout.name}</InfoItem>
                        <InfoItem><strong>Тип:</strong> {previewWorkout.type}</InfoItem>
                        <InfoItem><strong>Длительность:</strong> {previewWorkout.duration} минут</InfoItem>
                        {previewWorkout.description && <InfoItem><strong>Описание:</strong> {previewWorkout.description}</InfoItem>}
                      </WorkoutInfo>

                      <ExercisesList>
                        <h3>Упражнения:</h3>
                        {previewWorkout.exercises?.length > 0 ? (
                          previewWorkout.exercises.map((exercise: any) => (
                            <ExerciseItem key={exercise.id}>
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
                            </ExerciseItem>
                          ))
                        ) : (
                          <p>Нет упражнений</p>
                        )}
                      </ExercisesList>
                    </ModalContent>
                  </ModalOverlay>
                )}
              </>
            )}
          </div>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AssignWorkoutModal;