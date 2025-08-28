import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaChartLine,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag,
  FaArrowUp,
  FaUsers,
  FaPrint
} from 'react-icons/fa';

function Sales() {
  const { sales, dispatch } = useBusiness();
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const [formData, setFormData] = useState({
    orderNo: '',
    productName: '',
    customerName: '',
    phoneNo: '',
    emailAddress: '',
    shippingAddress: '',
    paymentMethod: '',
    quantity: '',
    sellingPrice: '',
    expenses: '',
    totalRevenue: '',
    wholesalePrice: '',
    totalProfit: ''
  });

  const paymentMethods = ['Cash On Delivery', 'Bank Transfer', 'Online Payment', 'Credit Card'];

  useEffect(() => {
    if (editingSale) {
      setFormData({
        orderNo: editingSale.orderNo || '',
        productName: editingSale.productName || '',
        customerName: editingSale.customerName || '',
        phoneNo: editingSale.phoneNo || '',
        emailAddress: editingSale.emailAddress || '',
        shippingAddress: editingSale.shippingAddress || '',
        paymentMethod: editingSale.paymentMethod || '',
        quantity: editingSale.quantity || '',
        sellingPrice: editingSale.sellingPrice || '',
        expenses: editingSale.expenses || '',
        totalRevenue: editingSale.totalRevenue || '',
        wholesalePrice: editingSale.wholesalePrice || '',
        totalProfit: editingSale.totalProfit || ''
      });
    }
  }, [editingSale]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotalRevenue = () => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    return sellingPrice * quantity;
  };

  const calculateTotalProfit = () => {
    const totalRevenue = calculateTotalRevenue();
    const wholesaleCost = parseFloat(formData.wholesalePrice) || 0;
    const expenses = parseFloat(formData.expenses) || 0;
    const quantity = parseInt(formData.quantity) || 0;
    
    return totalRevenue - (wholesaleCost * quantity) - expenses;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totalRevenue = calculateTotalRevenue();
    const totalProfit = calculateTotalProfit();
    
    const saleData = {
      ...formData,
      orderNo: parseInt(formData.orderNo),
      quantity: parseInt(formData.quantity),
      sellingPrice: parseFloat(formData.sellingPrice),
      expenses: parseFloat(formData.expenses),
      totalRevenue: totalRevenue,
      wholesalePrice: parseFloat(formData.wholesalePrice),
      totalProfit: totalProfit,
      // Additional calculated fields
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      costOfGoods: parseFloat(formData.wholesalePrice) * parseInt(formData.quantity)
    };

    if (editingSale) {
      dispatch({
        type: 'UPDATE_SALE',
        payload: { ...editingSale, ...saleData }
      });
    } else {
      dispatch({
        type: 'ADD_SALE',
        payload: saleData
      });
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      orderNo: '',
      productName: '',
      customerName: '',
      phoneNo: '',
      emailAddress: '',
      shippingAddress: '',
      paymentMethod: '',
      quantity: '',
      sellingPrice: '',
      expenses: '',
      totalRevenue: '',
      wholesalePrice: '',
      totalProfit: ''
    });
    setEditingSale(null);
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      dispatch({ type: 'DELETE_SALE', payload: id });
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

  const filteredAndSortedSales = sales
    .filter(sale => {
      const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.orderNo.toString().includes(searchTerm);
      return matchesSearch;
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

  const totalRevenue = filteredAndSortedSales.reduce((total, sale) => total + sale.totalRevenue, 0);
  const totalProfit = filteredAndSortedSales.reduce((total, sale) => total + sale.totalProfit, 0);
  const totalSales = filteredAndSortedSales.length;
  const averageProfit = totalSales > 0 ? totalProfit / totalSales : 0;
  const totalExpenses = filteredAndSortedSales.reduce((total, sale) => total + sale.expenses, 0);
  const totalCostOfGoods = filteredAndSortedSales.reduce((total, sale) => total + (sale.wholesalePrice * sale.quantity), 0);

  return (
    <div className="sales-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaShoppingBag className="page-icon" />
            PrinceVibe Orders Management
          </h1>
          <p className="page-subtitle">Track customer orders, sales performance, and profitability</p>
        </div>
        <button className="btn btn-primary btn-large" onClick={() => setShowModal(true)}>
          <FaPlus /> New Order
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-item primary">
          <div className="summary-icon">
            <FaShoppingBag />
          </div>
          <div className="summary-content">
            <div className="summary-value">{totalSales}</div>
            <div className="summary-label">Total Orders</div>
            <div className="summary-trend">
              <FaArrowUp className="trend-icon" />
              <span>Active</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item success">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(totalRevenue)}</div>
            <div className="summary-label">Total Revenue</div>
            <div className="summary-trend">
              <FaArrowUp className="trend-icon" />
              <span>Revenue</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item profit">
          <div className="summary-icon">
            <FaChartLine />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(totalProfit)}</div>
            <div className="summary-label">Total Profit</div>
            <div className="summary-trend">
              <FaArrowUp className="trend-icon" />
              <span>Profit</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item info">
          <div className="summary-icon">
            <FaUsers />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(averageProfit)}</div>
            <div className="summary-label">Avg Profit/Order</div>
            <div className="summary-trend">
              <FaArrowUp className="trend-icon" />
              <span>Per Order</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="stat-card">
          <h3>Cost Breakdown</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Cost of Goods:</span>
              <span className="stat-value cost">{formatCurrency(totalCostOfGoods)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Expenses:</span>
              <span className="stat-value expense">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Net Profit:</span>
              <span className="stat-value profit">{formatCurrency(totalProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by product name, customer, or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-info">
          <span className="filter-count">{filteredAndSortedSales.length} of {sales.length} orders</span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Orders & Sales</h3>
          <div className="table-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
              <FaPrint /> Print
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table modern-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('orderNo')} className="sortable">
                  <div className="th-content">
                    <span>Order No.</span>
                    {getSortIcon('orderNo')}
                  </div>
                </th>
                <th onClick={() => handleSort('productName')} className="sortable">
                  <div className="th-content">
                    <span>Product</span>
                    {getSortIcon('productName')}
                  </div>
                </th>
                <th onClick={() => handleSort('customerName')} className="sortable">
                  <div className="th-content">
                    <span>Customer</span>
                    {getSortIcon('customerName')}
                  </div>
                </th>
                <th>Contact Details</th>
                <th onClick={() => handleSort('sellingPrice')} className="sortable">
                  <div className="th-content">
                    <span>Selling Price</span>
                    {getSortIcon('sellingPrice')}
                  </div>
                </th>
                <th onClick={() => handleSort('wholesalePrice')} className="sortable">
                  <div className="th-content">
                    <span>Wholesale</span>
                    {getSortIcon('wholesalePrice')}
                  </div>
                </th>
                <th onClick={() => handleSort('expenses')} className="sortable">
                  <div className="th-content">
                    <span>Expenses</span>
                    {getSortIcon('expenses')}
                  </div>
                </th>
                <th onClick={() => handleSort('totalProfit')} className="sortable">
                  <div className="th-content">
                    <span>Profit</span>
                    {getSortIcon('totalProfit')}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSales.map(sale => (
                <tr key={sale._id} className="table-row">
                  <td className="order-no">
                    <div className="order-badge">#{sale.orderNo}</div>
                  </td>
                  <td className="product-info">
                    <div className="product-name">{sale.productName}</div>
                    <div className="product-meta">
                      <span className="quantity-badge">Qty: {sale.quantity}</span>
                    </div>
                  </td>
                  <td className="customer-info">
                    <div className="customer-name">{sale.customerName}</div>
                    <div className="customer-meta">
                      <span className="payment-badge">{sale.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="contact-info">
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{sale.phoneNo}</span>
                    </div>
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span className="email-text">{sale.emailAddress}</span>
                    </div>
                    <div className="contact-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <span className="address-text">{sale.shippingAddress}</span>
                    </div>
                  </td>
                  <td className="selling-price">
                    <div className="price-display">{formatCurrency(sale.sellingPrice)}</div>
                  </td>
                  <td className="wholesale-price">
                    <div className="price-display cost">{formatCurrency(sale.wholesalePrice)}</div>
                  </td>
                  <td className="expenses">
                    <div className="price-display expense">{formatCurrency(sale.expenses)}</div>
                  </td>
                  <td className="profit-cell">
                    <div className={`profit-badge ${sale.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(sale.totalProfit)}
                    </div>
                  </td>
                  <td className="actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(sale)}
                        title="Edit Order"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(sale._id)}
                        title="Delete Order"
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
        
        {filteredAndSortedSales.length === 0 && (
          <div className="no-data">
            <FaShoppingBag className="no-data-icon" />
            <h3>No Orders Found</h3>
            <p>Start by adding your first order to track sales and profits</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <FaPlus /> Add First Order
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSale ? 'Edit Order' : 'New Order'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section">
                <h3 className="section-title">Order Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order No. *</label>
                    <input
                      type="number"
                      name="orderNo"
                      value={formData.orderNo}
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
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Customer Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Shipping Address</label>
                    <textarea
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter shipping address"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Pricing & Costs</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price (PKR) *</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
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
                    <label className="form-label">Additional Expenses (PKR)</label>
                    <input
                      type="number"
                      name="expenses"
                      value={formData.expenses}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Order Analysis</h3>
                <div className="sale-analysis">
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <span className="analysis-label">Total Revenue:</span>
                      <span className="analysis-value revenue">{formatCurrency(calculateTotalRevenue())}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Cost of Goods:</span>
                      <span className="analysis-value cost">{formatCurrency((parseFloat(formData.wholesalePrice) || 0) * (parseInt(formData.quantity) || 0))}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Total Expenses:</span>
                      <span className="analysis-value expense">{formatCurrency(parseFloat(formData.expenses) || 0)}</span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Net Profit:</span>
                      <span className={`analysis-value ${calculateTotalProfit() >= 0 ? 'profit' : 'loss'}`}>
                        {formatCurrency(calculateTotalProfit())}
                      </span>
                    </div>
                    <div className="analysis-item">
                      <span className="analysis-label">Profit Margin:</span>
                      <span className={`analysis-value ${calculateTotalProfit() >= 0 ? 'profit' : 'loss'}`}>
                        {calculateTotalRevenue() > 0 ? (calculateTotalProfit() / calculateTotalRevenue() * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="analysis-note">
                    <small>Revenue and profit are calculated automatically based on your inputs.</small>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSale ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
