import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const TrainerRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  // const decodedToken = JSON.parse(atob(token.split('.')[1]));
  // const role = decodedToken.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken: any = jwtDecode(token);
  const role = decodedToken.role;

  return role === 'trainer' ? <Outlet /> : <Navigate to="/profile" />;
};

export default TrainerRoute;