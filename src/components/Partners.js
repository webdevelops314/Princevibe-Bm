import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency } from '../utils/formatters';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaDollarSign,
  FaChartPie,
  FaCog,
  FaUserPlus,
  FaUserEdit,
  FaUserTimes,
  FaPercentage,
  FaHandshake,
  FaArrowUp
} from 'react-icons/fa';

function Partners() {
  const { partners, settings, dispatch } = useBusiness();
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);

  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    share: 50,
    email: '',
    phone: '',
    notes: ''
  });

  const [settingsFormData, setSettingsFormData] = useState({
    reinvestmentPercentage: 70,
    currency: 'PKR',
    businessName: 'PrinceVibe Business Manager',
    taxRate: 0
  });

  useEffect(() => {
    if (editingPartner) {
      setPartnerFormData({
        name: editingPartner.name || '',
        share: editingPartner.share || 50,
        email: editingPartner.email || '',
        phone: editingPartner.phone || '',
        notes: editingPartner.notes || ''
      });
    }
  }, [editingPartner]);

  useEffect(() => {
    if (settings) {
      setSettingsFormData({
        reinvestmentPercentage: settings.reinvestmentPercentage || 70,
        currency: settings.currency || 'PKR',
        businessName: settings.businessName || 'PrinceVibe Business Manager',
        taxRate: settings.taxRate || 0
      });
    }
  }, [settings]);

  const handlePartnerInputChange = (e) => {
    const { name, value } = e.target;
    setPartnerFormData(prev => ({
      ...prev,
      [name]: name === 'share' ? parseFloat(value) : value
    }));
  };

  const handleSettingsInputChange = (e) => {
    const { name, value } = e.target;
    setSettingsFormData(prev => ({
      ...prev,
      [name]: name === 'reinvestmentPercentage' || name === 'taxRate' ? parseFloat(value) : value
    }));
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    
    if (editingPartner) {
      dispatch({
        type: 'UPDATE_PARTNER',
        payload: { ...editingPartner, ...partnerFormData }
      });
    } else {
      dispatch({
        type: 'ADD_PARTNER',
        payload: partnerFormData
      });
    }

    resetPartnerForm();
    setShowPartnerModal(false);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: settingsFormData
    });

    setEditingSettings(false);
  };

  const resetPartnerForm = () => {
    setPartnerFormData({
      name: '',
      share: 50,
      email: '',
      phone: '',
      notes: ''
    });
    setEditingPartner(null);
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setShowPartnerModal(true);
  };

  const handleDeletePartner = (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      dispatch({ type: 'DELETE_PARTNER', payload: id });
    }
  };

  const handleEditSettings = () => {
    setEditingSettings(true);
    setShowSettingsModal(true);
  };

  // Calculate total shares
  const totalShares = partners.reduce((sum, partner) => sum + partner.share, 0);
  const isValidShareDistribution = Math.abs(totalShares - 100) < 0.01; // Allow for small floating point differences

  // Get business performance data for partner distribution preview
  const getBusinessPerformance = () => {
    // This would typically come from your business context
    // For now, using sample data
    return {
      totalRevenue: 50000,
      totalExpenses: 30000,
      netProfit: 20000
    };
  };

  const businessPerformance = getBusinessPerformance();
  const reinvestmentAmount = businessPerformance.netProfit * (settingsFormData.reinvestmentPercentage / 100);
  const distributionAmount = businessPerformance.netProfit * ((100 - settingsFormData.reinvestmentPercentage) / 100);

  return (
    <div className="partners-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaUsers className="page-icon" />
            Partners & Business Settings
          </h1>
          <p className="page-subtitle">Manage business partners and configure business settings</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleEditSettings}>
            <FaCog /> Business Settings
          </button>
          <button className="btn btn-primary" onClick={() => setShowPartnerModal(true)}>
            <FaPlus /> Add Partner
          </button>
        </div>
      </div>

      {/* Partners Summary */}
      <div className="summary-grid">
        <div className="summary-item primary">
          <div className="summary-icon">
            <FaUsers />
          </div>
          <div className="summary-content">
            <div className="summary-value">{partners.length}</div>
            <div className="summary-label">Total Partners</div>
            <div className="summary-trend">
              <FaHandshake className="trend-icon" />
              <span>Active</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item success">
          <div className="summary-icon">
            <FaPercentage />
          </div>
          <div className="summary-content">
            <div className="summary-value">{totalShares}%</div>
            <div className="summary-label">Total Shares</div>
            <div className={`summary-trend ${isValidShareDistribution ? 'valid' : 'invalid'}`}>
              {isValidShareDistribution ? <FaHandshake className="trend-icon" /> : <FaUserTimes className="trend-icon" />}
              <span>{isValidShareDistribution ? 'Valid' : 'Invalid'}</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item profit">
          <div className="summary-icon">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(distributionAmount)}</div>
            <div className="summary-label">Available for Distribution</div>
            <div className="summary-trend">
              <FaChartPie className="trend-icon" />
              <span>30% of Profit</span>
            </div>
          </div>
        </div>
        
        <div className="summary-item info">
          <div className="summary-icon">
            <FaChartPie />
          </div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(reinvestmentAmount)}</div>
            <div className="summary-label">Reinvestment Amount</div>
            <div className="summary-trend">
              <FaArrowUp className="trend-icon" />
              <span>70% of Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Share Validation Alert */}
      {!isValidShareDistribution && (
        <div className="alert alert-warning">
          <div className="alert-icon">
            <FaUserTimes />
          </div>
          <div className="alert-content">
            <h4>Share Distribution Issue</h4>
            <p>Total partner shares must equal 100%. Current total: {totalShares}%</p>
            <p>Please adjust partner shares to ensure proper distribution.</p>
          </div>
        </div>
      )}

      {/* Partners Management */}
      <div className="partners-section">
        <div className="section-header">
          <h3>Partners Management</h3>
          <p>Manage business partners and their profit shares</p>
        </div>
        
        <div className="partners-grid">
          {partners.map(partner => (
            <div key={partner._id} className="partner-card">
              <div className="partner-header">
                <div className="partner-avatar">
                  <FaUsers />
                </div>
                <div className="partner-info">
                  <h4 className="partner-name">{partner.name}</h4>
                  <div className="partner-share">{partner.share}% Share</div>
                </div>
                <div className="partner-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEditPartner(partner)}
                    title="Edit Partner"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePartner(partner._id)}
                    title="Delete Partner"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="partner-details">
                {partner.email && (
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{partner.email}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{partner.phone}</span>
                  </div>
                )}
                {partner.notes && (
                  <div className="detail-item">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{partner.notes}</span>
                  </div>
                )}
              </div>
              
              <div className="partner-distribution">
                <div className="distribution-preview">
                  <span className="preview-label">Estimated Distribution:</span>
                  <span className="preview-amount">
                    {formatCurrency(distributionAmount * (partner.share / 100))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {partners.length === 0 && (
          <div className="no-partners">
            <FaUsers className="no-partners-icon" />
            <h3>No Partners Added</h3>
            <p>Start by adding your first business partner</p>
            <button className="btn btn-primary" onClick={() => setShowPartnerModal(true)}>
              <FaUserPlus /> Add First Partner
            </button>
          </div>
        )}
      </div>

      {/* Business Settings */}
      <div className="settings-section">
        <div className="section-header">
          <h3>Business Settings</h3>
          <p>Configure business parameters and profit distribution rules</p>
        </div>
        
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-header">
              <FaCog className="setting-icon" />
              <h4>Profit Distribution</h4>
            </div>
            <div className="setting-content">
              <div className="setting-item">
                <span className="setting-label">Reinvestment Percentage:</span>
                <span className="setting-value">{settingsFormData.reinvestmentPercentage}%</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Partner Distribution:</span>
                <span className="setting-value">{100 - settingsFormData.reinvestmentPercentage}%</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Currency:</span>
                <span className="setting-value">{settingsFormData.currency}</span>
              </div>
            </div>
          </div>
          
          <div className="setting-card">
            <div className="setting-header">
              <FaChartPie className="setting-icon" />
              <h4>Distribution Preview</h4>
            </div>
            <div className="setting-content">
              <div className="setting-item">
                <span className="setting-label">Net Profit:</span>
                <span className="setting-value">{formatCurrency(businessPerformance.netProfit)}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Reinvestment:</span>
                <span className="setting-value">{formatCurrency(reinvestmentAmount)}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">For Partners:</span>
                <span className="setting-value">{formatCurrency(distributionAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="modal-overlay" onClick={() => setShowPartnerModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
              <button className="modal-close" onClick={() => setShowPartnerModal(false)}>×</button>
            </div>
            
            <form onSubmit={handlePartnerSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Partner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={partnerFormData.name}
                    onChange={handlePartnerInputChange}
                    className="form-input"
                    placeholder="Enter partner name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Profit Share (%) *</label>
                  <input
                    type="number"
                    name="share"
                    value={partnerFormData.share}
                    onChange={handlePartnerInputChange}
                    className="form-input"
                    placeholder="50"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={partnerFormData.email}
                    onChange={handlePartnerInputChange}
                    className="form-input"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={partnerFormData.phone}
                    onChange={handlePartnerInputChange}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    value={partnerFormData.notes}
                    onChange={handlePartnerInputChange}
                    className="form-input"
                    placeholder="Additional notes about this partner..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <div className="share-validation">
                    <div className="validation-item">
                      <span className="validation-label">Current Total Shares:</span>
                      <span className={`validation-value ${isValidShareDistribution ? 'valid' : 'invalid'}`}>
                        {totalShares}%
                      </span>
                    </div>
                    <div className="validation-item">
                      <span className="validation-label">Required Total:</span>
                      <span className="validation-value">100%</span>
                    </div>
                    {!isValidShareDistribution && (
                      <div className="validation-warning">
                        ⚠️ Total shares must equal 100% for proper profit distribution
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPartnerModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPartner ? 'Update Partner' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Business Settings</h2>
              <button className="modal-close" onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSettingsSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={settingsFormData.businessName}
                    onChange={handleSettingsInputChange}
                    className="form-input"
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    name="currency"
                    value={settingsFormData.currency}
                    onChange={handleSettingsInputChange}
                    className="form-input"
                  >
                    <option value="PKR">PKR (Pakistani Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Reinvestment Percentage (%)</label>
                  <input
                    type="number"
                    name="reinvestmentPercentage"
                    value={settingsFormData.reinvestmentPercentage}
                    onChange={handleSettingsInputChange}
                    className="form-input"
                    placeholder="70"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <small className="form-help">
                    Percentage of profit to reinvest in business (remaining goes to partners)
                  </small>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tax Rate (%)</label>
                  <input
                    type="number"
                    name="taxRate"
                    value={settingsFormData.taxRate}
                    onChange={handleSettingsInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <small className="form-help">
                    Business tax rate for calculations
                  </small>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettingsModal(false)}>
                  Cancel
 </button>
                <button type="submit" className="btn btn-primary">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Partners;
