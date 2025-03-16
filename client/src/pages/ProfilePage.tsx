/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';

interface AvatarProps{
  src: string
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Avatar = styled.div<AvatarProps>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${(props) => (props.src ? 'transparent' : '#ccc')};
  background-image: ${(props) => (props.src ? `url(${props.src})` : 'url(http://localhost:5000/uploads/default.png)')};
  background-size: cover;
  background-position: center;
  margin: 0 auto 20px;
`;

const Field = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const Value = styled.span`
  color: #555;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [trainerId, setTrainerId] = useState<number | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [avatar, setAvatar] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setUser(response.data);
        setFullname(response.data.fullname || '');
        setPhoneNumber(response.data.phone_number || '');
        setTrainerId(response.data.trainer_id || '');
        setSpecialization(response.data.specialization || '');
        setAvatar(response.data.avatar || '')

        const metricsResponse = await api.get('/profile/metrics');
        setMetrics(metricsResponse.data);

        const trainersResponse = await api.get('/profile/trainers');
        setTrainers(trainersResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await api.put('/profile', {
        fullname,
        phone_number: phoneNumber,
        trainer_id: trainerId,
        specialization,
        avatar
      });
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data);
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload avatar');
    }
  };

  const handleAddMetrics = async () => {
    try {
      await api.post('/profile/metrics', {
        height: parseFloat(height),
        weight: parseFloat(weight),
      });
      const metricsResponse = await api.get('/profile/metrics');
      setMetrics(metricsResponse.data);
      setHeight('');
      setWeight('');
      alert('Metrics added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add metrics');
    }
  };

  if (!user) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>Profile</h1>
      <Avatar src={user.avatar} />
      <input type="file" accept="image/*" onChange={handleAvatarUpload} />

      <Field>
        <Label>Username:</Label>
        <Value>{user.username}</Value>
      </Field>
      <Field>
        <Label>Email:</Label>
        <Value>{user.email}</Value>
      </Field>
      <Field>
        <Label>Account Created:</Label>
        <Value>{new Date(user.created_at).toLocaleDateString()}</Value>
      </Field>
      <Field>
        <Label>Role:</Label>
        <Value>{user.role}</Value>
      </Field>

      {isEditing ? (
        <>
          <Field>
            <Label>Full Name:</Label>
            <Input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </Field>
          <Field>
            <Label>Phone Number:</Label>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Field>
          {user.role === 'client' && (
            <Field>
              <Label>Trainer:</Label>
              <Select
                value={trainerId}
                onChange={(e) => setTrainerId(Number(e.target.value))}
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.username}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {user.role === 'trainer' && (
            <Field>
              <Label>Specialization:</Label>
              <Input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </Field>
          )}
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </>
      ) : (
        <>
          <Field>
            <Label>Full Name:</Label>
            <Value>{user.fullname || 'Not set'}</Value>
          </Field>
          <Field>
            <Label>Phone Number:</Label>
            <Value>{user.phone_number || 'Not set'}</Value>
          </Field>
          {user.role === 'client' && (
            <Field>
              <Label>Trainer:</Label>
              <Value>{trainers.find((t) => t.id === user.trainer_id)?.username || 'Not set'}</Value>
            </Field>
          )}
          {user.role === 'trainer' && (
            <Field>
              <Label>Specialization:</Label>
              <Value>{user.specialization || 'Not set'}</Value>
            </Field>
          )}
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </>
      )}

      {user.role === 'client' && (
        <>
          <h2>Metrics</h2>
          <Field>
            <Label>Height:</Label>
            <Input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </Field>
          <Field>
            <Label>Weight:</Label>
            <Input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Field>
          <Button onClick={handleAddMetrics}>Add Metrics</Button>

          <h3>Metrics History</h3>
          {metrics.map((metric) => (
            <Field key={metric.id}>
              <Label>Date:</Label>
              <Value>{new Date(metric.date).toLocaleDateString()}</Value>
              <Label>Height:</Label>
              <Value>{metric.height} cm</Value>
              <Label>Weight:</Label>
              <Value>{metric.weight} kg</Value>
            </Field>
          ))}
        </>
      )}
    </Container>
  );
};

export default ProfilePage;