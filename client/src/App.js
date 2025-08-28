import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import Sidebar from './components/Sidebar';
import MobileLayout from './components/MobileLayout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Purchases from './components/Purchases';
import Sales from './components/Sales';
import Expenses from './components/Expenses';
import ProfitLoss from './components/ProfitLoss';
import Partners from './components/Partners';
import DataLoader from './components/DataLoader';
import LoadingScreen from './components/LoadingScreen';
import DatabaseStatus from './components/DatabaseStatus';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { isLoading, error, isConnected, isInitialized } = useBusiness();
  const { isAuthenticated, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderContent = () => (
    <>
      <LoadingScreen 
        isLoading={isLoading} 
        error={error} 
        isConnected={isConnected} 
        isInitialized={isInitialized} 
      />
      <DatabaseStatus 
        isConnected={isConnected} 
        isInitialized={isInitialized} 
        error={error} 
      />
      {isInitialized && (
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute>
              <Purchases />
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } />
          <Route path="/profit-loss" element={
            <ProtectedRoute>
              <ProfitLoss />
            </ProtectedRoute>
          } />
          <Route path="/partners" element={
            <ProtectedRoute>
              <Partners />
            </ProtectedRoute>
          } />
          <Route path="/data-loader" element={
            <ProtectedRoute>
              <DataLoader />
            </ProtectedRoute>
          } />
        </Routes>
      )}
    </>
  );

  if (isMobile) {
    return (
      <MobileLayout>
        {renderContent()}
      </MobileLayout>
    );
  }

  return (
    <div className="app desktop-layout">
      <Sidebar />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BusinessProvider>
          <AppContent />
        </BusinessProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
