import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { account } = useAuth();

  if (!account) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(account.role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;