import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-large">
            <div className="spinner"></div>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
}

export default ProtectedRoute;
