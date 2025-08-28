import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency } from '../utils/formatters';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaShoppingCart,
  FaCalendarAlt,
  FaUser,
  FaBoxes,
  FaDollarSign
} from 'react-icons/fa';

function Purchases() {
  const { inventory, purchases, dispatch } = useBusiness();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [formData, setFormData] = useState({
    productName: '',
    supplier: '',
    quantity: '',
    costPrice: '',
    boxPrice: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPurchase = {
      ...formData,
      id: Date.now(),
      quantity: parseInt(formData.quantity),
      costPrice: parseFloat(formData.costPrice),
      boxPrice: parseFloat(formData.boxPrice),
      totalCost: (parseFloat(formData.costPrice) + parseFloat(formData.boxPrice)) * parseInt(formData.quantity)
    };

    // Add purchase
    dispatch({
      type: 'UPDATE_PURCHASES',
      payload: [...purchases, newPurchase]
    });

    // Update inventory
    const existingItem = inventory.find(item => item.name === formData.productName);
    if (existingItem) {
      const updatedInventory = inventory.map(item =>
        item.name === formData.productName
          ? { ...item, quantity: item.quantity + parseInt(formData.quantity) }
          : item
      );
      dispatch({
        type: 'UPDATE_INVENTORY',
        payload: updatedInventory
      });
    } else {
      // Add new product to inventory
      const newProduct = {
        id: Date.now(),
        name: formData.productName,
        category: 'New Purchase',
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.costPrice) * 1.5, // Default markup
        quantity: parseInt(formData.quantity),
        boxPrice: parseFloat(formData.boxPrice),
        supplier: formData.supplier,
        description: formData.notes,
        dateAdded: new Date().toISOString()
      };
      dispatch({
        type: 'UPDATE_INVENTORY',
        payload: [...inventory, newProduct]
      });
    }

    setFormData({
      productName: '',
      supplier: '',
      quantity: '',
      costPrice: '',
      boxPrice: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddModal(false);
  };

  // Filter and search
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || purchase.supplier === supplierFilter;
    const matchesDate = dateFilter === 'all' || purchase.date === dateFilter;
    return matchesSearch && matchesSupplier && matchesDate;
  });

  const suppliers = [...new Set(purchases.map(purchase => purchase.supplier))];
  const dates = [...new Set(purchases.map(purchase => purchase.date))];
  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const totalItems = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);

  return (
    <div className="purchases-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Purchase Management</h1>
        <p className="page-subtitle">Track wholesale purchases and manage supplier relationships</p>
      </div>

      {/* Purchase Summary */}
      <div className="summary-grid">
        <div className="summary-item summary-primary">
          <div className="summary-icon">
            <FaShoppingCart />
          </div>
          <div className="summary-content">
            <div className="summary-value">{purchases.length}</div>
            <div className="summary-label">Total Purchases</div>
          </div>
        </div>

        <div className="summary-item summary-success">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(totalPurchases)}</div>
            <div className="summary-label">Total Spent</div>
          </div>
        </div>

        <div className="summary-item summary-warning">
          <div className="summary-icon">
            <FaBoxes />
          </div>
          <div className="summary-content">
            <div className="summary-value">{totalItems}</div>
            <div className="summary-label">Total Items</div>
          </div>
        </div>

        <div className="summary-item summary-info">
          <div className="summary-icon">
            <FaUser />
          </div>
          <div className="summary-content">
            <div className="summary-value">{suppliers.length}</div>
            <div className="summary-label">Suppliers</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-section">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <FaUser className="filter-icon" />
            <select
              className="filter-select"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="all">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
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
          <FaPlus /> Add New Purchase
        </button>
      </div>

      {/* Purchases Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Purchase History</h2>
          <div className="card-subtitle">
            {filteredPurchases.length} of {purchases.length} purchases
          </div>
        </div>

        {filteredPurchases.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Cost Price</th>
                  <th>Box Price</th>
                  <th>Total Cost</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>
                      <div className="product-info">
                        <div className="product-name">{purchase.productName}</div>
                      </div>
                    </td>
                    <td>
                      <span className="supplier-badge">{purchase.supplier}</span>
                    </td>
                    <td className="quantity">{purchase.quantity}</td>
                    <td className="cost-price">{formatCurrency(purchase.costPrice)}</td>
                    <td className="box-price">{formatCurrency(purchase.boxPrice)}</td>
                    <td className="total-cost">{formatCurrency(purchase.totalCost)}</td>
                    <td>{new Date(purchase.date).toLocaleDateString()}</td>
                    <td>
                      {purchase.notes && (
                        <div className="notes-text">{purchase.notes}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <FaShoppingCart className="no-data-icon" />
            <p>No purchases found matching your search criteria.</p>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Add Your First Purchase
            </button>
          </div>
        )}
      </div>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Purchase</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Supplier *</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    required
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Purchase Date *</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cost Price (PKR) *</label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Box Price (PKR) *</label>
                  <input
                    type="number"
                    name="boxPrice"
                    value={formData.boxPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
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
                  placeholder="Additional notes about this purchase..."
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
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;
