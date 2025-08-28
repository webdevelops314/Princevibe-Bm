const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Inventory API
  async getInventory() {
    return this.request('/inventory');
  }

  async createInventoryItem(item) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateInventoryItem(id, updates) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteInventoryItem(id) {
    return this.request(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales API
  async getSales() {
    return this.request('/sales');
  }

  async createSale(sale) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
  }

  async updateSale(id, updates) {
    return this.request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSale(id) {
    return this.request(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  // Purchases API
  async getPurchases() {
    return this.request('/purchases');
  }

  async createPurchase(purchase) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
  }

  async updatePurchase(id, updates) {
    return this.request(`/purchases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePurchase(id) {
    return this.request(`/purchases/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses API
  async getExpenses() {
    return this.request('/expenses');
  }

  async createExpense(expense) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id, updates) {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Partners API
  async getPartners() {
    return this.request('/partners');
  }

  async createPartner(partner) {
    return this.request('/partners', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  }

  async updatePartner(id, updates) {
    return this.request(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePartner(id) {
    return this.request(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings API
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(id, updates) {
    return this.request(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Data Migration API
  async migrateData(data) {
    return this.request('/migrate', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }

  // Search functionality
  async searchInventory(query) {
    const inventory = await this.getInventory();
    return inventory.filter(item => 
      item.productName.toLowerCase().includes(query.toLowerCase()) ||
      item.productNo.toString().includes(query)
    );
  }

  async searchSales(query) {
    const sales = await this.getSales();
    return sales.filter(sale => 
      sale.productName.toLowerCase().includes(query.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(query.toLowerCase()) ||
      sale.orderNo.toString().includes(query)
    );
  }

  async searchExpenses(query) {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => 
      expense.description.toLowerCase().includes(query.toLowerCase()) ||
      expense.category.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new ApiService();
