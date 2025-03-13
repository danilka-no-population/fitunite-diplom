/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const WorkoutCard = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
`;

const ExerciseCard = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const WorkoutList: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await api.get('/workouts');
        const workoutsWithExercises = await Promise.all(
          response.data.map(async (workout: any) => {
            const exercisesResponse = await api.get(`/workouts/${workout.id}/exercises`);
            return { ...workout, exercises: exercisesResponse.data };
          })
        );
        setWorkouts(workoutsWithExercises);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchWorkouts();
  }, [refresh]);

  return (
    <Container>
      <h1>My Workouts</h1>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id}>
          <h3>{new Date(workout.date).toLocaleDateString()}</h3>
          <p>Duration: {workout.duration} minutes</p>
          <p>Feeling: {workout.feeling}</p>
          <h4>Exercises:</h4>
          {workout.exercises?.map((exercise: any) => (
            <ExerciseCard key={exercise.id}>
              <p>Exercise: {exercise.name}</p>
              <p>Category: {exercise.category}</p>
              {exercise.type === 'cardio' ? (
                <>
                  <p>Duration: {exercise.duration} minutes</p>
                  <p>Distance: {exercise.distance} km</p>
                  {/* <p>Average Speed: {(exercise.distance / (exercise.duration / 60)).toFixed(2)} km/h</p> */}
                  <p>Average Speed: {Number(exercise.distance) / (Number(exercise.duration) / 60)} km/h</p>
                </>
              ) : (
                <>
                  <p>Sets: {exercise.sets}</p>
                  <p>Reps: {exercise.reps}</p>
                  <p>Weight: {exercise.weight} kg</p>
                </>
              )}
            </ExerciseCard>
          ))}
        </WorkoutCard>
      ))}
    </Container>
  );
};

export default WorkoutList;