// src/components/PublicOnlyRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicOnlyRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user?.role === 'donor') {
    return <Navigate to="/donor-dashboard" replace />;
  } else if (user?.role === 'organization') {
    return <Navigate to="/organization-dashboard" replace />;
  }

  return children;
}
