/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const ExerciseForm = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const AddWorkout: React.FC<{ onWorkoutAdded: () => void }> = ({ onWorkoutAdded }) => {
  const [date, setDate] = useState((new Date()).toDateString());
  const [duration, setDuration] = useState('');
  const [feeling, setFeeling] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Оздоровление');
  const [exercises, setExercises] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
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

  const handleAddExercise = () => {
    setExercises([...exercises, { exerciseId: '', sets: '', reps: '', weight: '', duration: '', distance: '' }]);
  };

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          distance: exercise.distance,
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
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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
        type="text"
        placeholder="Длительность тренировки (минуты)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      {role === 'client' && (
        <>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Ощущения"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
        </>
      )}
      <h3>Упражнения:</h3>
      {exercises.map((exercise, index) => {
  // Преобразуем строковый ID в число (если надо)
  const selectedExercise = availableExercises.find((ex) => String(ex.id) === String(exercise.exerciseId));

  return (
    <ExerciseForm key={index}>
      <Select
        value={exercise.exerciseId}
        onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
        required
      >
        <option value="" disabled>Выберите упражнение</option>
        {availableExercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name} ({ex.category})
          </option>
        ))}
      </Select>

      {/* Проверяем, что упражнение выбрано и у него есть категория */}
      {selectedExercise?.category === 'Бег' ? (
        <>
          <Input
            type="text"
            placeholder="Продолжительность (минуты)"
            value={exercise.duration}
            onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Расстояние (км)"
            value={exercise.distance}
            onChange={(e) => handleExerciseChange(index, 'distance', e.target.value)}
            required
          />
          {(() => {
            exercise.sets = 0
            exercise.reps = 0
            exercise.weight = 0
          })()}
        </>
      ) : (
        <>
          <Input
            type="number"
            placeholder="Подходы"
            value={exercise.sets}
            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Повторения"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Вес (кг)"
            value={exercise.weight}
            onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
            required
          />
        </>
      )}
    </ExerciseForm>
  );
})}
      <Button type="button" onClick={handleAddExercise}>
        Добавить упражнение
      </Button>
      <Button type="submit">Сохранить тренировку</Button>
    </Form>
  );
};

export default AddWorkout;