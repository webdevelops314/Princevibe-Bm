import React from 'react';
import { FaSpinner, FaDatabase, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

function LoadingScreen({ isLoading, error, isConnected, isInitialized }) {
  if (isInitialized && !isLoading) {
    return null;
  }

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : error ? (
            <FaExclamationTriangle className="error-icon" />
          ) : (
            <FaCheckCircle className="success-icon" />
          )}
        </div>
        
        <h2 className="loading-title">
          {isLoading ? 'Initializing Business Manager...' : 
           error ? 'Initialization Failed' : 
           'Ready to Go!'}
        </h2>
        
        <p className="loading-message">
          {isLoading ? 'Setting up your business management system...' :
           error ? 'Unable to initialize. Please refresh the page.' :
           'Your business manager is ready! All data is safely stored locally.'}
        </p>
        
        {isLoading && (
          <div className="loading-steps">
            <div className={`step ${isConnected ? 'completed' : ''}`}>
              <span className="step-icon">
                {isConnected ? <FaCheckCircle /> : <FaSpinner className="spinner" />}
              </span>
              <span className="step-text">System Initialization</span>
            </div>
            
            <div className={`step ${isInitialized ? 'completed' : ''}`}>
              <span className="step-icon">
                {isInitialized ? <FaCheckCircle /> : <FaSpinner className="spinner" />}
              </span>
              <span className="step-text">Data Loading</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-details">
            <p className="error-message">{error}</p>
            <p className="fallback-message">
              Please refresh the page to try again.
            </p>
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="info-details">
            <p className="info-message">
              💡 <strong>MongoDB Ready:</strong> Your app is prepared for future cloud database integration!
            </p>
            <p className="info-details-text">
              Currently using secure local storage. When you're ready for cloud sync, 
              we'll connect to your MongoDB Atlas cluster automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingScreen;
