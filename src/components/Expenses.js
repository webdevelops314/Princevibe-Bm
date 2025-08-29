import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency } from '../utils/formatters';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaReceipt,
  FaCalendarAlt,
  FaDollarSign,
  FaChartPie,
  FaExclamationTriangle,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

function Expenses() {
  const { expenses, dispatch } = useBusiness();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newExpense = {
        ...formData,
        _id: Date.now().toString() + Math.random(),
        amount: parseFloat(formData.amount),
        date: new Date().toISOString()
      };

      // Save to database
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense)
      });

      if (!response.ok) {
        throw new Error(`Failed to add expense: ${response.status}`);
      }

      // Update local state
      dispatch({
        type: 'ADD_EXPENSE',
        payload: newExpense
      });

      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense: ' + error.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedExpense = {
        ...editingExpense,
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString()
      };

      // Save to database
      const response = await fetch(`/api/expenses/${updatedExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense)
      });

      if (!response.ok) {
        throw new Error(`Failed to update expense: ${response.status}`);
      }

      // Update local state
      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: updatedExpense
      });

      setShowEditModal(false);
      setEditingExpense(null);
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Error updating expense: ' + error.message);
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        // Delete from database
        const response = await fetch(`/api/expenses/${expenseId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Failed to delete expense: ${response.status}`);
        }

        // Update local state
        dispatch({
          type: 'DELETE_EXPENSE',
          payload: expenseId
        });
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense: ' + error.message);
      }
    }
  };

  // Filter and search
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesDate = dateFilter === 'all' || expense.date === dateFilter;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const categories = [...new Set(expenses.map(expense => expense.category))];
  const dates = [...new Set(expenses.map(expense => expense.date))];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Get category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="expenses-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Expense Management</h1>
        <p className="page-subtitle">Track business expenses and analyze spending patterns</p>
      </div>

      {/* Expense Summary */}
      <div className="summary-grid">
        <div className="summary-item summary-primary">
          <div className="summary-icon">
            <FaReceipt />
          </div>
          <div className="summary-content">
            <div className="summary-value">{expenses.length}</div>
            <div className="summary-label">Total Expenses</div>
          </div>
        </div>

        <div className="summary-item summary-danger">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(totalExpenses)}</div>
            <div className="summary-label">Total Amount</div>
          </div>
        </div>

        <div className="summary-item summary-warning">
          <div className="summary-icon">
            <FaChartPie />
          </div>
          <div className="summary-content">
            <div className="summary-value">{categories.length}</div>
            <div className="summary-label">Categories</div>
          </div>
        </div>

        <div className="summary-item summary-info">
          <div className="summary-icon">
            <FaExclamationTriangle />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(averageExpense)}</div>
            <div className="summary-label">Average Expense</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Expense Categories</h2>
            <div className="card-subtitle">Breakdown of expenses by category</div>
          </div>
          <div className="category-breakdown">
            {topCategories.map(([category, amount]) => (
              <div key={category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">{formatCurrency(amount)}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-bar-fill"
                    style={{ 
                      width: `${(amount / totalExpenses) * 100}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search expenses or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <FaFilter className="filter-icon" />
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <FaCalendarAlt className="filter-icon" />
            <select
              className="filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              {dates.map(date => (
                <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add New Expense
        </button>
      </div>

      {/* Expenses Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Expense History</h2>
          <div className="card-subtitle">
            {filteredExpenses.length} of {expenses.length} expenses
          </div>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>
                      <div className="expense-info">
                        <div className="expense-description">{expense.description}</div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{expense.category}</span>
                    </td>
                    <td className="expense-amount">{formatCurrency(expense.amount)}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>
                      {expense.notes && (
                        <div className="notes-text">{expense.notes}</div>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(expense)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(expense.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <FaReceipt className="no-data-icon" />
            <p>No expenses found matching your search criteria.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Add Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Expense</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Enter expense description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (PKR) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Office">Office</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Additional notes about this expense..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Edit Expense</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Enter expense description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (PKR) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Office">Office</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  placeholder="Additional notes about this expense..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get category colors
function getCategoryColor(category) {
  const colors = {
    'Marketing': '#3b82f6',
    'Delivery': '#10b981',
    'Office': '#f59e0b',
    'Utilities': '#ef4444',
    'Rent': '#8b5cf6',
    'Other': '#6b7280'
  };
  return colors[category] || '#6b7280';
}

export default Expenses;
