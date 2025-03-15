import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const TrainerRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const role = decodedToken.role;

  return role === 'trainer' ? <Outlet /> : <Navigate to="/programs" />;
};

export default TrainerRoute;