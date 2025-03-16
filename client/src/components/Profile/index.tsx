import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';

const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const Value = styled.span`
  color: #555;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
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

const SaveButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Profile: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trainerId, setTrainerId] = useState<number | ''>('');
  const [specialization, setSpecialization] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
        setFullname(response.data.fullname || '');
        setAvatar(response.data.avatar || '');
        setPhoneNumber(response.data.phone_number || '');
        setTrainerId(response.data.trainer_id || '');
        setSpecialization(response.data.specialization || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.put('/profile', {
        fullname,
        avatar,
        phone_number: phoneNumber,
        trainer_id: trainerId,
        specialization,
      });
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>Profile</h1>
      {!isEditing ? (
        <ProfileInfo>
          <Field>
            <Label>Username:</Label>
            <Value>{user.username}</Value>
          </Field>
          <Field>
            <Label>Email:</Label>
            <Value>{user.email}</Value>
          </Field>
          <Field>
            <Label>Full Name:</Label>
            <Value>{user.fullname || 'Not set'}</Value>
          </Field>
          <Field>
            <Label>Avatar:</Label>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
            ) : (
              <Value>Not set</Value>
            )}
          </Field>
          <Field>
            <Label>Phone Number:</Label>
            <Value>{user.phone_number || 'Not set'}</Value>
          </Field>
          {user.role === 'client' && (
            <Field>
              <Label>Trainer ID:</Label>
              <Value>{user.trainer_id || 'Not set'}</Value>
            </Field>
          )}
          {user.role === 'trainer' && (
            <Field>
              <Label>Specialization:</Label>
              <Value>{user.specialization || 'Not set'}</Value>
            </Field>
          )}
          <EditButton onClick={handleEditClick}>Edit</EditButton>
        </ProfileInfo>
      ) : (
        <Form onSubmit={handleSave}>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {user.role === 'client' && (
            <Input
              type="number"
              placeholder="Trainer ID"
              value={trainerId}
              onChange={(e) => setTrainerId(Number(e.target.value))}
            />
          )}
          {user.role === 'trainer' && (
            <Input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          )}
          <SaveButton type="submit">Save</SaveButton>
        </Form>
      )}
    </Container>
  );
};

export default Profile;