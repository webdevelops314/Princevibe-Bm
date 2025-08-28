import React from 'react';
import { FaDatabase, FaCheckCircle, FaExclamationTriangle, FaWifi } from 'react-icons/fa';

function DatabaseStatus({ isConnected, isInitialized, error }) {
  if (!isInitialized) return null;

  return (
    <div className="database-status">
      <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-icon">
          {isConnected ? (
            <FaCheckCircle className="connected-icon" />
          ) : error ? (
            <FaExclamationTriangle className="error-icon" />
          ) : (
            <FaWifi className="disconnected-icon" />
          )}
        </div>
        
        <div className="status-info">
          <div className="status-text">
            {isConnected ? 'System Ready' : 'Local Storage Mode'}
          </div>
          <div className="status-details">
            {isConnected 
              ? 'Business manager initialized successfully' 
              : 'Using secure local storage'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatabaseStatus;
