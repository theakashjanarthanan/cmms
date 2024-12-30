// frontend\src\components\ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
