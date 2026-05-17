import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== 'ROLE_ADMIN') {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PrivateRoute;