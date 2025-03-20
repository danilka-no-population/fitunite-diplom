import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Form = styled.form`
  margin-top: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddWorkoutComment: React.FC<{ workoutId: number; onCommentAdded: () => void }> = ({ workoutId, onCommentAdded }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/workout-comments', { workout_id: workoutId, comment });
      setComment('');
      onCommentAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <Button type="submit">Add Comment</Button>
    </Form>
  );
};

export default AddWorkoutComment;