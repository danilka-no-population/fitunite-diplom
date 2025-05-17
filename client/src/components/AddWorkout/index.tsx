/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import ScrollReveal from '../ScrollReveal';

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

const Button = styled.button`
  padding: clamp(10px, 2vw, 15px) clamp(15px, 4vw, 25px);
  background-color: #058E3A;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: clamp(0.7rem, 4.5vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #046b2d;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 142, 58, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ExerciseForm = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: #f5f9ff;
  border: 1px solid #e0e9ff;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  color: #05396B;
  margin-bottom: 15px;
`;

const ExerciseInputs = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RemoveButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.type === 'button' ? '#A80003' : '#A80003'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  @media (max-width: 600px){
    font-size: 0.8rem;
    padding: 10px 15px;
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

const ErrorMessage = styled.div`
  color: #A80003;
  background-color: rgba(168, 0, 3, 0.1);
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AddWorkout: React.FC<{ onWorkoutAdded: () => void }> = ({ onWorkoutAdded }) => {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [feeling, setFeeling] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Оздоровление');
  const [exercises, setExercises] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const role = jwtDecode(localStorage.getItem('token')).role;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setAvailableExercises(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
        setErrorField('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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

  const validateForm = () => {
    // Проверка даты
    if (!date) {
      setError('Вы не выбрали дату');
      setErrorField('date');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      setError('Нельзя указать дату позже сегодняшнего дня');
      setErrorField('date');
      return false;
    }

    // Проверка длительности
    if (!duration) {
      setError('Вы не указали продолжительность тренировки');
      setErrorField('duration');
      return false;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum)) {
      setError('Длительность тренировки должна быть числом');
      setErrorField('duration');
      return false;
    }

    if (durationNum < 1 || durationNum > 180) {
      setError('Длительность тренировки должна быть от 1 до 180 минут');
      setErrorField('duration');
      return false;
    }

    // Проверка упражнений
    if (exercises.length === 0) {
      setError('Добавьте хотя бы одно упражнение');
      setErrorField('exercises');
      return false;
    }

    // Проверка полей упражнений
    for (const [index, exercise] of exercises.entries()) {
      if (!exercise.exerciseId) {
        setError(`В упражнении ${index + 1} не выбран тип`);
        setErrorField(`exercise-${index}-select`);
        return false;
      }

      const selectedExercise = availableExercises.find(ex => ex.id === parseInt(exercise.exerciseId));
      const isRunning = selectedExercise?.category === 'Бег';

      if (isRunning) {
        if (!exercise.duration) {
          setError(`В упражнении ${index + 1} не указана продолжительность`);
          setErrorField(`exercise-${index}-duration`);
          return false;
        }

        const durationNum = parseInt(exercise.duration);
        if (isNaN(durationNum)) {
          setError(`В упражнении ${index + 1} продолжительность должна быть числом`);
          setErrorField(`exercise-${index}-duration`);
          return false;
        }

        if (durationNum < 1 || durationNum > 200) {
          setError(`В упражнении ${index + 1} продолжительность должна быть от 1 до 200 минут`);
          setErrorField(`exercise-${index}-duration`);
          return false;
        }

        if (!exercise.distance) {
          setError(`В упражнении ${index + 1} не указано расстояние`);
          setErrorField(`exercise-${index}-distance`);
          return false;
        }

        const distanceNum = parseFloat(exercise.distance);
        if (isNaN(distanceNum)) {
          setError(`В упражнении ${index + 1} расстояние должно быть числом`);
          setErrorField(`exercise-${index}-distance`);
          return false;
        }

        if (distanceNum < 0.5 || distanceNum > 50) {
          setError(`В упражнении ${index + 1} расстояние должно быть от 0.5 до 50 км`);
          setErrorField(`exercise-${index}-distance`);
          return false;
        }
      } else {
        if (!exercise.sets) {
          setError(`В упражнении ${index + 1} не указано количество подходов`);
          setErrorField(`exercise-${index}-sets`);
          return false;
        }

        const setsNum = parseInt(exercise.sets);
        if (isNaN(setsNum)) {
          setError(`В упражнении ${index + 1} подходы должны быть числом`);
          setErrorField(`exercise-${index}-sets`);
          return false;
        }

        if (setsNum < 1 || setsNum > 200) {
          setError(`В упражнении ${index + 1} подходы должны быть от 1 до 200`);
          setErrorField(`exercise-${index}-sets`);
          return false;
        }

        if (!exercise.reps) {
          setError(`В упражнении ${index + 1} не указано количество повторений`);
          setErrorField(`exercise-${index}-reps`);
          return false;
        }

        const repsNum = parseInt(exercise.reps);
        if (isNaN(repsNum)) {
          setError(`В упражнении ${index + 1} повторения должны быть числом`);
          setErrorField(`exercise-${index}-reps`);
          return false;
        }

        if (repsNum < 1 || repsNum > 500) {
          setError(`В упражнении ${index + 1} повторения должны быть от 1 до 500`);
          setErrorField(`exercise-${index}-reps`);
          return false;
        }

        if (!exercise.weight) {
          const weightNum = parseFloat(exercise.weight);
          if (isNaN(weightNum)) {
            setError(`В упражнении ${index + 1} не указан вес`);
            setErrorField(`exercise-${index}-weight`);
            return false;
          }
        }

        if (exercise.weight) {
          const weightNum = parseFloat(exercise.weight);
          if (isNaN(weightNum)) {
            setError(`В упражнении ${index + 1} вес должен быть числом`);
            setErrorField(`exercise-${index}-weight`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorField('');

    if (!validateForm()) return;

    try {
      const workoutResponse = await api.post('/workouts', {
        date,
        duration,
        feeling,
        name,
        description,
        type,
      });

      const workoutId = workoutResponse.data.id;

      for (const exercise of exercises) {
        await api.post('/workouts/exercises', {
          workout_id: workoutId,
          exercise_id: exercise.exerciseId,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps),
          weight: Number(exercise.weight),
          duration: Number(exercise.duration),
          distance: Number(exercise.distance),
        });
      }

      onWorkoutAdded();
      setDate('');
      setDuration('');
      setFeeling('');
      setName('');
      setDescription('');
      setType('Оздоровление');
      setExercises([]);
    } catch (error) {
      console.error(error);
      setError('Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <ScrollReveal>
      <Form onSubmit={handleSubmit} noValidate>
        <h2>{role === 'trainer' ? 'Создать тренировку' : 'Добавить тренировку'}</h2>
        
        {role === 'trainer' && (
          <>
            <Input
              type="text"
              placeholder="Название тренировки"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Описание тренировки"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Оздоровление">Оздоровление</option>
              <option value="Похудение">Похудение</option>
              <option value="Выносливость">Выносливость</option>
              <option value="Сила">Сила</option>
              <option value="Кардио">Кардио</option>
            </Select>
          </>
        )}

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={errorField === 'date' ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
        />

        <Input
          type="number"
          placeholder="Длительность тренировки (минуты, 1-180)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
          max="180"
          required
          style={errorField === 'duration' ? { borderColor: '#A80003', backgroundColor: 'rgba(168, 0, 3, 0.05)' } : {}}
        />

        {role === 'client' && (
          <Input
            type="text"
            placeholder="Ощущения (необязательно)"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
        )}

        <SectionTitle>Упражнения:</SectionTitle>
        
        {exercises.map((exercise, index) => {
          const selectedExercise = availableExercises.find(ex => ex.id === parseInt(exercise.exerciseId));
          const isRunning = selectedExercise?.category === 'Бег';
          const exerciseErrorPrefix = `exercise-${index}`;

          return (
            <ExerciseForm key={index}>
              <Select
                value={exercise.exerciseId}
                onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
                required
                style={errorField.startsWith(`${exerciseErrorPrefix}-select`) ? { 
                  borderColor: '#A80003', 
                  backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                } : {}}
              >
                <option value="" disabled>Выберите упражнение</option>
                {availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.category})
                  </option>
                ))}
              </Select>

              {isRunning ? (
                <ExerciseInputs>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Продолжительность (1-200 минут)"
                      value={exercise.duration}
                      onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                      min="1"
                      max="200"
                      required
                      style={errorField.startsWith(`${exerciseErrorPrefix}-duration`) ? { 
                        borderColor: '#A80003', 
                        backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                      } : {}}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Расстояние (0.5-50 км)"
                      value={exercise.distance}
                      onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
                      step="0.1"
                      min="0.5"
                      max="50"
                      required
                      style={errorField.startsWith(`${exerciseErrorPrefix}-distance`) ? { 
                        borderColor: '#A80003', 
                        backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                      } : {}}
                    />
                  </div>
                </ExerciseInputs>
              ) : (
                <ExerciseInputs>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Подходы (1-200)"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                      min="1"
                      max="200"
                      required
                      style={errorField.startsWith(`${exerciseErrorPrefix}-sets`) ? { 
                        borderColor: '#A80003', 
                        backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                      } : {}}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Повторения (1-500)"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      min="1"
                      max="500"
                      required
                      style={errorField.startsWith(`${exerciseErrorPrefix}-reps`) ? { 
                        borderColor: '#A80003', 
                        backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                      } : {}}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="number"
                      placeholder="Вес (кг)"
                      value={exercise.weight}
                      onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                      min="0"
                      style={errorField.startsWith(`${exerciseErrorPrefix}-weight`) ? { 
                        borderColor: '#A80003', 
                        backgroundColor: 'rgba(168, 0, 3, 0.05)' 
                      } : {}}
                    />
                  </div>
                </ExerciseInputs>
              )}
              <RemoveButton type="button" onClick={() => handleRemoveExercise(index)}>
                Удалить упражнение
              </RemoveButton>
            </ExerciseForm>
          );
        })}

        <Button type="button" onClick={handleAddExercise} style={{backgroundColor: '#05396B'}}>
          Добавить упражнение
        </Button>

        <hr style={{height: '5px', backgroundColor: '#053a6b63', borderRadius: '10%'}}/>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit">Сохранить тренировку</Button>
      </Form>
    </ScrollReveal>
  );
};

export default AddWorkout;