import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
`;

const Button = styled.button`
  padding: 15px 20px;
  background-color: #05396B;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  
  &:hover {
    background-color: #042a52;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(5, 57, 107, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AddMealComment: React.FC<{ mealId: number; onCommentAdded: () => void }> = ({ mealId, onCommentAdded }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/meal-comments', { meal_id: mealId, comment });
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
        placeholder="Добавить комментарий"
        required
      />
      <Button type="submit">Добавить комментарий</Button>
    </Form>
  );
};

export default AddMealComment;