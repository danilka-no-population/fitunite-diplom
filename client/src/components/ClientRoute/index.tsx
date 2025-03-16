import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ClientRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken: any = jwtDecode(token);
  const role = decodedToken.role;

  return role === 'client' ? <Outlet /> : <Navigate to="/profile" />;
};

export default ClientRoute;