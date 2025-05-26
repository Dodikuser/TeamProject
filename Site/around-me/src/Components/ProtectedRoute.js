import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if authentication is required but user is not authenticated
    return <Navigate to="/login" />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to account if user is authenticated but tries to access login/register
    return <Navigate to="/account" />;
  }

  return children;
};

export default ProtectedRoute; 