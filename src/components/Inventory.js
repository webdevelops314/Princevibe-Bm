import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency } from '../utils/formatters';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaBoxes,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

function Inventory() {
  const { inventory, dispatch } = useBusiness();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('productNo');
  const [sortDirection, setSortDirection] = useState('asc');

  const [formData, setFormData] = useState({
    productNo: '',
    productName: '',
    fullStock: '',
    wholesalePrice: '',
    boxPrice: '',
    marketingCost: '',
    deliveryCost: '',
    finalPrice: ''
  });

  const categories = ['Watches', 'Accessories', 'Parts', 'Other'];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        productNo: editingItem.productNo || '',
        productName: editingItem.productName || '',
        fullStock: editingItem.fullStock || '',
        wholesalePrice: editingItem.wholesalePrice || '',
        boxPrice: editingItem.boxPrice || '',
        marketingCost: editingItem.marketingCost || '',
        deliveryCost: editingItem.deliveryCost || '',
        finalPrice: editingItem.finalPrice || ''
      });
    }
  }, [editingItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotalCost = () => {
    const wholesale = parseFloat(formData.wholesalePrice) || 0;
    const box = parseFloat(formData.boxPrice) || 0;
    const marketing = parseFloat(formData.marketingCost) || 0;
    const delivery = parseFloat(formData.deliveryCost) || 0;
    
    return wholesale + box + marketing + delivery;
  };

  const calculateProfit = () => {
    const totalCost = calculateTotalCost();
    const finalPrice = parseFloat(formData.finalPrice) || 0;
    
    return finalPrice - totalCost;
  };

  const calculateProfitPercentage = () => {
    const totalCost = calculateTotalCost();
    const profit = calculateProfit();
    
    if (totalCost === 0) return 0;
    return (profit / totalCost) * 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      productNo: parseInt(formData.productNo),
      fullStock: parseInt(formData.fullStock),
      wholesalePrice: parseFloat(formData.wholesalePrice),
      boxPrice: parseFloat(formData.boxPrice),
      marketingCost: parseFloat(formData.marketingCost),
      deliveryCost: parseFloat(formData.deliveryCost),
      finalPrice: parseFloat(formData.finalPrice),
      // Additional calculated fields for business logic
      costPrice: parseFloat(formData.wholesalePrice) + parseFloat(formData.boxPrice),
      totalExpenses: parseFloat(formData.marketingCost) + parseFloat(formData.deliveryCost),
      totalCost: calculateTotalCost(),
      profit: calculateProfit(),
      profitPercentage: calculateProfitPercentage()
    };

    if (editingItem) {
      dispatch({
        type: 'UPDATE_INVENTORY_ITEM',
        payload: { ...editingItem, ...itemData }
      });
    } else {
      dispatch({
        type: 'ADD_INVENTORY_ITEM',
        payload: itemData
      });
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      productNo: '',
      productName: '',
      fullStock: '',
      wholesalePrice: '',
      boxPrice: '',
      marketingCost: '',
      deliveryCost: '',
      finalPrice: ''
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_INVENTORY_ITEM', payload: id });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const filteredAndSortedInventory = inventory
    .filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productNo.toString().includes(searchTerm);
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalInventoryValue = filteredAndSortedInventory.reduce((total, item) => {
    return total + (item.costPrice * item.fullStock);
  }, 0);

  const totalProducts = filteredAndSortedInventory.length;
  const lowStockItems = filteredAndSortedInventory.filter(item => item.fullStock <= 5);

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1 className="page-title">
          <FaBoxes className="page-icon" />
          PrinceVibe Products Management
        </h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-icon">
            <FaBoxes />
          </div>
          <div className="summary-content">
            <div className="summary-value">{totalProducts}</div>
            <div className="summary-label">Total Products</div>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(totalInventoryValue)}</div>
            <div className="summary-label">Total Inventory Value</div>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(filteredAndSortedInventory.reduce((total, item) => total + (item.finalPrice * item.fullStock), 0))}</div>
            <div className="summary-label">Total Selling Value</div>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <FaBoxes />
          </div>
          <div className="summary-content">
            <div className="summary-value">{lowStockItems.length}</div>
            <div className="summary-label">Low Stock Items</div>
          </div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('productNo')} className="sortable">
                Product No. {getSortIcon('productNo')}
              </th>
              <th onClick={() => handleSort('productName')} className="sortable">
                Product Name {getSortIcon('productName')}
              </th>
              <th onClick={() => handleSort('fullStock')} className="sortable">
                Full Stock {getSortIcon('fullStock')}
              </th>
              <th onClick={() => handleSort('wholesalePrice')} className="sortable">
                Wholesale Price {getSortIcon('wholesalePrice')}
              </th>
              <th onClick={() => handleSort('boxPrice')} className="sortable">
                Box Price {getSortIcon('boxPrice')}
              </th>
              <th onClick={() => handleSort('marketingCost')} className="sortable">
                Marketing Cost {getSortIcon('marketingCost')}
              </th>
              <th onClick={() => handleSort('deliveryCost')} className="sortable">
                Delivery Cost {getSortIcon('deliveryCost')}
              </th>
              <th onClick={() => handleSort('finalPrice')} className="sortable">
                Final Price {getSortIcon('finalPrice')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedInventory.map(item => (
              <tr key={item._id} className={item.fullStock <= 5 ? 'low-stock-row' : ''}>
                <td className="product-no">{item.productNo}</td>
                <td className="product-info">
                  <div className="product-name">{item.productName}</div>
                </td>
                <td className="full-stock">
                  <span className={item.fullStock <= 5 ? 'low-stock' : ''}>
                    {item.fullStock}
                  </span>
                </td>
                <td className="wholesale-price">{formatCurrency(item.wholesalePrice)}</td>
                <td className="box-price">{formatCurrency(item.boxPrice)}</td>
                <td className="marketing-cost">{formatCurrency(item.marketingCost)}</td>
                <td className="delivery-cost">{formatCurrency(item.deliveryCost)}</td>
                <td className="final-price">{formatCurrency(item.finalPrice)}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedInventory.length === 0 && (
          <div className="no-data">
            <FaBoxes />
            <p>No products found</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product No. *</label>
                  <input
                    type="number"
                    name="productNo"
                    value={formData.productNo}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Stock *</label>
                  <input
                    type="number"
                    name="fullStock"
                    value={formData.fullStock}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Wholesale Price (PKR) *</label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    value={formData.wholesalePrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Box Price (PKR)</label>
                  <input
                    type="number"
                    name="boxPrice"
                    value={formData.boxPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Marketing Cost (PKR)</label>
                  <input
                    type="number"
                    name="marketingCost"
                    value={formData.marketingCost}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Cost (PKR)</label>
                  <input
                    type="number"
                    name="deliveryCost"
                    value={formData.deliveryCost}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Final Price (PKR) *</label>
                  <input
                    type="number"
                    name="finalPrice"
                    value={formData.finalPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Cost & Profit Analysis</label>
                  <div className="cost-analysis">
                    <div className="analysis-item">
                      <span className="analysis-label">Total Cost:</span>
                      <span className="analysis-value cost">{formatCurrency(calculateTotalCost())}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Final Price:</span>
                      <span className="analysis-value price">{formatCurrency(parseFloat(formData.finalPrice) || 0)}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Profit:</span>
                      <span className={`analysis-value ${calculateProfit() >= 0 ? 'profit' : 'loss'}`}>
                        {formatCurrency(calculateProfit())}
                      </span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Profit %:</span>
                      <span className={`analysis-value ${calculateProfitPercentage() >= 0 ? 'profit' : 'loss'}`}>
                        {calculateProfitPercentage().toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <small className="form-help">
                    Set your desired final price to include profit margin. The system will calculate your profit automatically.
                  </small>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
