import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import apiService from '../services/apiService';

const BusinessContext = createContext();

const initialState = {
  inventory: [],
  purchases: [],
  sales: [],
  expenses: [],
  partners: [],
  settings: {
    reinvestmentPercentage: 70,
    currency: 'PKR',
    businessName: 'PrinceVibe Business Manager',
    taxRate: 0
  },
  isLoading: false,
  error: null,
  isConnected: false
};

const businessReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    
    case 'SET_PURCHASES':
      return { ...state, purchases: action.payload };
    
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    
    case 'SET_PARTNERS':
      return { ...state, partners: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };
    
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item =>
          item._id === action.payload._id ? action.payload : item
        )
      };
    
    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item._id !== action.payload)
      };
    
    case 'ADD_PURCHASE':
      return { ...state, purchases: [...state.purchases, action.payload] };
    
    case 'UPDATE_PURCHASES':
      return { ...state, purchases: action.payload };
    
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    
    case 'UPDATE_SALES':
      return { ...state, sales: action.payload };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSES':
      return { ...state, expenses: action.payload };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense._id === action.payload._id ? action.payload : expense
        )
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload)
      };
    
    case 'ADD_PURCHASE':
      return { ...state, purchases: [...state.purchases, action.payload] };
    
    case 'UPDATE_PARTNERS':
      return { ...state, partners: action.payload };
    
    case 'ADD_PARTNER':
      return { ...state, partners: [...state.partners, action.payload] };
    
    case 'UPDATE_PARTNER':
      return {
        ...state,
        partners: state.partners.map(partner => 
          partner._id === action.payload._id ? action.payload : partner
        )
      };
    
    case 'DELETE_PARTNER':
      return {
        ...state,
        partners: state.partners.filter(partner => partner._id !== action.payload)
      };
    
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    
    default:
      return state;
  }
};

export const BusinessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database connection and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Check API health
        try {
          await apiService.healthCheck();
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
          
          // Load data from database
          await loadFromDatabase();
        } catch (error) {
          console.log('API not available, falling back to localStorage');
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
          await loadFromLocalStorage();
        }
        
        setIsInitialized(true);
        dispatch({ type: 'SET_LOADING', payload: false });
        
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // Fallback to localStorage if needed
        console.log('🔄 Falling back to localStorage...');
        await loadFromLocalStorage();
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Load all data from database
  const loadFromDatabase = async () => {
    try {
      const [
        inventory,
        purchases,
        sales,
        expenses,
        partners,
        settings
      ] = await Promise.all([
        apiService.getInventory(),
        apiService.getPurchases(),
        apiService.getSales(),
        apiService.getExpenses(),
        apiService.getPartners(),
        apiService.getSettings()
      ]);

      dispatch({ type: 'SET_INVENTORY', payload: inventory });
      dispatch({ type: 'SET_PURCHASES', payload: purchases });
      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_PARTNERS', payload: partners });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      
    } catch (error) {
      console.error('Error loading data from database:', error);
      throw error;
    }
  };

  // Fallback to localStorage
  const loadFromLocalStorage = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem('princeVibeBusinessData') || '{}');
      
      dispatch({ type: 'SET_INVENTORY', payload: localData.inventory || [] });
      dispatch({ type: 'SET_PURCHASES', payload: localData.purchases || [] });
      dispatch({ type: 'SET_SALES', payload: localData.sales || [] });
      dispatch({ type: 'SET_EXPENSES', payload: localData.expenses || [] });
      dispatch({ type: 'SET_PARTNERS', payload: localData.partners || [] });
      dispatch({ type: 'SET_SETTINGS', payload: localData.settings || initialState.settings });
      
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Save data to localStorage as backup
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('princeVibeBusinessData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Business logic functions
  const calculateTotalInventoryValue = () => {
    return state.inventory.reduce((total, item) => {
      return total + (item.costPrice * item.quantity);
    }, 0);
  };

  const calculateTotalSales = () => {
    return state.sales.reduce((total, sale) => total + sale.totalRevenue, 0);
  };

  const calculateTotalPurchases = () => {
    return state.purchases.reduce((total, purchase) => total + purchase.totalCost, 0);
  };

  const calculateTotalExpenses = () => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateGrossProfit = () => {
    return calculateTotalSales() - calculateTotalPurchases();
  };

  const calculateNetProfit = () => {
    return calculateGrossProfit() - calculateTotalExpenses();
  };

  const calculateReinvestmentAmount = () => {
    return calculateNetProfit() * (state.settings.reinvestmentPercentage / 100);
  };

  const calculatePartnerDistribution = () => {
    const netProfit = calculateNetProfit();
    const reinvestmentAmount = calculateReinvestmentAmount();
    const availableForPartners = netProfit - reinvestmentAmount;
    
    return state.partners.map(partner => ({
      ...partner,
      amount: availableForPartners * (partner.share / 100)
    }));
  };

  // Migrate data from localStorage to database
  const migrateToDatabase = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem('princeVibeBusinessData') || '{}');
      await apiService.migrateData(localData);
      
      // Reload data from database
      await loadFromDatabase();
      
      // Clear localStorage after successful migration
      localStorage.removeItem('princeVibeBusinessData');
      
      return { success: true, message: 'Data migrated successfully to database' };
    } catch (error) {
      console.error('Error migrating data:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    ...state,
    dispatch,
    calculateTotalInventoryValue,
    calculateTotalSales,
    calculateTotalPurchases,
    calculateTotalExpenses,
    calculateGrossProfit,
    calculateNetProfit,
    calculateReinvestmentAmount,
    calculatePartnerDistribution,
    isInitialized,
    saveToLocalStorage,
    migrateToDatabase,
    loadFromDatabase
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
