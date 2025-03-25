/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const ExerciseForm: React.FC<{ 
  exercise: any, 
  availableExercises: any[],
  onChange: (exercise: any) => void 
}> = ({ exercise, availableExercises, onChange }) => {
  const selectedExercise = availableExercises.find(ex => 
    String(ex.id) === String(exercise.exerciseId)
  );

  const handleChange = (field: string, value: string) => {
    onChange({
      ...exercise,
      [field]: value
    });
  };

  const category = selectedExercise?.category || exercise.category

  return (
    <div>
      {category === 'Бег' ? (
        <>
          <Input
            type="number"
            placeholder="Duration (minutes)"
            value={exercise.duration || ''}
            onChange={(e) => handleChange('duration', e.target.value)}
            min="1"
          />
          <Input
            type="number"
            placeholder="Distance (km)"
            value={exercise.distance || ''}
            onChange={(e) => handleChange('distance', e.target.value)}
            min="1"
          />
        </>
      ) : (
        <>
          <Input
            type="number"
            placeholder="Sets"
            value={exercise.sets || ''}
            onChange={(e) => handleChange('sets', e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Reps"
            value={exercise.reps || ''}
            onChange={(e) => handleChange('reps', e.target.value)}
            min="0"
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={exercise.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value)}
            min="0"
          />
        </>
      )}
    </div>
  );
};

export default ExerciseForm;