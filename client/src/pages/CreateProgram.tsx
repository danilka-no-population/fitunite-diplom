import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const CreateProgram: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/programs', {
        name,
        description,
      });
      navigate('/programs');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <h1>Create Training Program</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextArea
          placeholder="Program Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit">Create Program</Button>
      </Form>
    </Container>
  );
};

export default CreateProgram;