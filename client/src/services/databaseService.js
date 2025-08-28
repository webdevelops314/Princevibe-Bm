// Database service layer - currently using localStorage with MongoDB preparation
// In production, this would connect to your MongoDB backend API

// Helper function to get data from localStorage
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return [];
  }
};

// Helper function to save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Inventory Operations
export const inventoryService = {
  async getAll() {
    try {
      const data = getFromStorage('inventory');
      return data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  },

  async create(item) {
    try {
      const data = getFromStorage('inventory');
      const newItem = {
        ...item,
        _id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        // Ensure all required fields have default values
        productNo: item.productNo || 1,
        productName: item.productName || '',
        fullStock: item.fullStock || 0,
        wholesalePrice: item.wholesalePrice || 0,
        boxPrice: item.boxPrice || 0,
        marketingCost: item.marketingCost || 0,
        deliveryCost: item.deliveryCost || 0,
        finalPrice: item.finalPrice || 0,
        // Additional calculated fields for business logic
        costPrice: (item.wholesalePrice || 0) + (item.boxPrice || 0),
        totalExpenses: (item.marketingCost || 0) + (item.deliveryCost || 0),
        totalCost: (item.wholesalePrice || 0) + (item.boxPrice || 0) + (item.marketingCost || 0) + (item.deliveryCost || 0),
        profit: (item.finalPrice || 0) - ((item.wholesalePrice || 0) + (item.boxPrice || 0) + (item.marketingCost || 0) + (item.deliveryCost || 0)),
        profitPercentage: ((item.wholesalePrice || 0) + (item.boxPrice || 0) + (item.marketingCost || 0) + (item.deliveryCost || 0)) > 0 ? 
          (((item.finalPrice || 0) - ((item.wholesalePrice || 0) + (item.boxPrice || 0) + (item.marketingCost || 0) + (item.deliveryCost || 0))) / 
           ((item.wholesalePrice || 0) + (item.boxPrice || 0) + (item.marketingCost || 0) + (item.deliveryCost || 0))) * 100 : 0
      };
      
      data.push(newItem);
      saveToStorage('inventory', data);
      
      console.log('💾 Inventory item saved to localStorage:', newItem);
      return newItem;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const data = getFromStorage('inventory');
      const index = data.findIndex(item => item._id === id);
      
      if (index !== -1) {
        // Calculate cost price, total cost, and profit
        const wholesalePrice = updates.wholesalePrice || data[index].wholesalePrice;
        const boxPrice = updates.boxPrice || data[index].boxPrice;
        const marketingCost = updates.marketingCost || data[index].marketingCost;
        const deliveryCost = updates.deliveryCost || data[index].deliveryCost;
        const finalPrice = updates.finalPrice || data[index].finalPrice;
        
        const totalCost = wholesalePrice + boxPrice + marketingCost + deliveryCost;
        const profit = finalPrice - totalCost;
        const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;
        
        const updatedItem = {
          ...data[index],
          ...updates,
          lastUpdated: new Date().toISOString(),
          costPrice: wholesalePrice + boxPrice,
          totalExpenses: marketingCost + deliveryCost,
          totalCost: totalCost,
          profit: profit,
          profitPercentage: profitPercentage
        };
        
        data[index] = updatedItem;
        saveToStorage('inventory', data);
        
        console.log('✏️ Inventory item updated in localStorage:', updatedItem);
        return updatedItem;
      }
      throw new Error('Item not found');
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = getFromStorage('inventory');
      const filteredData = data.filter(item => item._id !== id);
      saveToStorage('inventory', filteredData);
      
      console.log('🗑️ Inventory item deleted from localStorage:', id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },

  async search(query) {
    try {
      const data = getFromStorage('inventory');
      if (!query) return data;
      
      return data.filter(item => 
        item.productName.toLowerCase().includes(query.toLowerCase()) ||
        item.productNo.toString().includes(query)
      );
    } catch (error) {
      console.error('Error searching inventory:', error);
      return [];
    }
  }
};

// Purchase Operations
export const purchaseService = {
  async getAll() {
    try {
      const data = getFromStorage('purchases');
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }
  },

  async create(purchase) {
    try {
      const data = getFromStorage('purchases');
      const newPurchase = {
        ...purchase,
        _id: Date.now().toString()
      };
      
      data.push(newPurchase);
      saveToStorage('purchases', data);
      
      console.log('💾 Purchase saved to localStorage:', newPurchase);
      return newPurchase;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const data = getFromStorage('purchases');
      const index = data.findIndex(item => item._id === id);
      
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveToStorage('purchases', data);
        return data[index];
      }
      throw new Error('Purchase not found');
    } catch (error) {
      console.error('Error updating purchase:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = getFromStorage('purchases');
      const filteredData = data.filter(item => item._id !== id);
      saveToStorage('purchases', filteredData);
      return { success: true };
    } catch (error) {
      console.error('Error deleting purchase:', error);
      throw error;
    }
  }
};

// Sale Operations
export const saleService = {
  async getAll() {
    try {
      const data = getFromStorage('sales');
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error fetching sales:', error);
      return [];
    }
  },

  async create(sale) {
    try {
      const data = getFromStorage('sales');
      const newSale = {
        ...sale,
        _id: Date.now().toString()
      };
      
      data.push(newSale);
      saveToStorage('sales', data);
      
      console.log('💾 Sale saved to localStorage:', newSale);
      return newSale;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const data = getFromStorage('sales');
      const index = data.findIndex(item => item._id === id);
      
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveToStorage('sales', data);
        return data[index];
      }
      throw new Error('Sale not found');
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = getFromStorage('sales');
      const filteredData = data.filter(item => item._id !== id);
      saveToStorage('sales', filteredData);
      return { success: true };
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  }
};

// Expense Operations
export const expenseService = {
  async getAll() {
    try {
      const data = getFromStorage('expenses');
      return data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  },

  async create(expense) {
    try {
      const data = getFromStorage('expenses');
      const newExpense = {
        ...expense,
        _id: Date.now().toString()
      };
      
      data.push(newExpense);
      saveToStorage('expenses', data);
      
      console.log('💾 Expense saved to localStorage:', newExpense);
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const data = getFromStorage('expenses');
      const index = data.findIndex(item => item._id === id);
      
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveToStorage('expenses', data);
        return data[index];
      }
      throw new Error('Expense not found');
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = getFromStorage('expenses');
      const filteredData = data.filter(item => item._id !== id);
      saveToStorage('expenses', filteredData);
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};

// Partner Operations
export const partnerService = {
  async getAll() {
    try {
      const data = getFromStorage('partners');
      if (data.length === 0) {
        // Return default partners if none exist
        const defaultPartners = [
          { _id: '1', name: 'Partner 1', share: 50, email: '', phone: '', notes: '' },
          { _id: '2', name: 'Partner 2', share: 50, email: '', phone: '', notes: '' }
        ];
        saveToStorage('partners', defaultPartners);
        return defaultPartners;
      }
      return data.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    } catch (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
  },

  async create(partner) {
    try {
      const data = getFromStorage('partners');
      const newPartner = {
        ...partner,
        _id: Date.now().toString(),
        dateAdded: new Date().toISOString()
      };
      
      data.push(newPartner);
      saveToStorage('partners', data);
      
      console.log('💾 Partner saved to localStorage:', newPartner);
      return newPartner;
    } catch (error) {
      console.error('Error creating partner:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const data = getFromStorage('partners');
      const index = data.findIndex(item => item._id === id);
      
      if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveToStorage('partners', data);
        return data[index];
      }
      throw new Error('Partner not found');
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = getFromStorage('partners');
      const filteredData = data.filter(item => item._id !== id);
      saveToStorage('partners', filteredData);
      return { success: true };
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  }
};

// Settings Operations
export const settingsService = {
  async get() {
    try {
      const data = getFromStorage('settings');
      if (!data || Object.keys(data).length === 0) {
        // Return default settings if none exist
        const defaultSettings = {
          reinvestmentPercentage: 70,
          currency: 'PKR',
          businessName: 'PrinceVibe Business Manager',
          taxRate: 0
        };
        saveToStorage('settings', defaultSettings);
        return defaultSettings;
      }
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        reinvestmentPercentage: 70,
        currency: 'PKR',
        businessName: 'PrinceVibe Business Manager',
        taxRate: 0
      };
    }
  },

  async update(updates) {
    try {
      const currentSettings = await this.get();
      const updatedSettings = { ...currentSettings, ...updates };
      saveToStorage('settings', updatedSettings);
      
      console.log('💾 Settings updated in localStorage:', updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

// Data Migration Helper (for future MongoDB integration)
export const migrateFromLocalStorage = async (localData) => {
  try {
    console.log('🔄 Starting data migration preparation...');
    console.log('💡 Note: This is a preparation step for future MongoDB integration');
    
    // For now, just log what would be migrated
    if (localData.inventory && localData.inventory.length > 0) {
      console.log(`📦 ${localData.inventory.length} inventory items ready for migration`);
    }
    if (localData.purchases && localData.purchases.length > 0) {
      console.log(`🛒 ${localData.purchases.length} purchases ready for migration`);
    }
    if (localData.sales && localData.sales.length > 0) {
      console.log(`💰 ${localData.sales.length} sales ready for migration`);
    }
    if (localData.expenses && localData.expenses.length > 0) {
      console.log(`💸 ${localData.expenses.length} expenses ready for migration`);
    }
    if (localData.partners && localData.partners.length > 0) {
      console.log(`👥 ${localData.partners.length} partners ready for migration`);
    }
    if (localData.settings) {
      console.log('⚙️ Business settings ready for migration');
    }

    console.log('✅ Data migration preparation completed!');
    console.log('🚀 Ready for MongoDB integration when backend is implemented');
    return true;
  } catch (error) {
    console.error('❌ Error during data migration preparation:', error);
    throw error;
  }
};
