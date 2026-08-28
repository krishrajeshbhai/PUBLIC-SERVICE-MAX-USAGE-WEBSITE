import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthUser, subscribeAuth } from '../../store/authStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const [user, setUser] = useState(getAuthUser());

  useEffect(() => {
    return subscribeAuth(setUser);
  }, []);

  if (!user) {
    if (requiredRole === 'employee') {
      return <Navigate to="/employee/login" replace />;
    }
    if (requiredRole === 'visitor') {
      return <Navigate to="/visitor/welcome" replace />;
    }
    if (requiredRole === 'passenger') {
      return <Navigate to="/passenger/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'employee') {
      return <Navigate to="/employee/login" replace />;
    }
    if (requiredRole === 'visitor') {
      return <Navigate to="/visitor/welcome" replace />;
    }
    if (requiredRole === 'passenger') {
      return <Navigate to="/passenger/login" replace />;
    }
  }

  return children;
}
