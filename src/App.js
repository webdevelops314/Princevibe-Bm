import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import Sidebar from './components/Sidebar';
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
import './App.css';

function AppContent() {
  const { isLoading, error, isConnected, isInitialized } = useBusiness();

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
                               <Route path="/expenses" element={<Expenses />} />
                   <Route path="/profit-loss" element={<ProfitLoss />} />
                   <Route path="/partners" element={<Partners />} />
                   <Route path="/data-loader" element={<DataLoader />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BusinessProvider>
        <AppContent />
      </BusinessProvider>
    </Router>
  );
}

export default App;
