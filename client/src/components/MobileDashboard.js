import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  FaBoxes, 
  FaShoppingCart, 
  FaChartLine, 
  FaReceipt, 
  FaUsers, 
  FaDatabase,
  FaPlus,
  FaSearch
} from 'react-icons/fa';
import { formatCurrency, formatNumber } from '../utils/formatters';

function MobileDashboard() {
  const { inventory, sales, purchases, expenses, partners } = useBusiness();

  // Calculate summary data
  const totalInventory = inventory.length;
  const totalSales = sales.length;
  const totalPurchases = purchases.length;
  const totalExpenses = expenses.length;
  const totalPartners = partners.length;

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.finalPrice || 0), 0);
  const totalExpenseAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalProfit = totalRevenue - totalExpenseAmount;

  const summaryItems = [
    { 
      icon: FaBoxes, 
      value: totalInventory, 
      label: 'Products', 
      color: '#059669',
      path: '/inventory'
    },
    { 
      icon: FaChartLine, 
      value: formatCurrency(totalRevenue), 
      label: 'Revenue', 
      color: '#EA580C',
      path: '/sales'
    },
    { 
      icon: FaReceipt, 
      value: formatCurrency(totalExpenseAmount), 
      label: 'Expenses', 
      color: '#7C3AED',
      path: '/expenses'
    },
    { 
      icon: FaChartLine, 
      value: formatCurrency(totalProfit), 
      label: 'Profit', 
      color: '#0891B2',
      path: '/profit-loss'
    }
  ];

  const quickActions = [
    { 
      icon: FaPlus, 
      label: 'Add Product', 
      path: '/inventory',
      color: '#059669'
    },
    { 
      icon: FaShoppingCart, 
      label: 'New Purchase', 
      path: '/purchases',
      color: '#DC2626'
    },
    { 
      icon: FaChartLine, 
      label: 'Record Sale', 
      path: '/sales',
      color: '#EA580C'
    },
    { 
      icon: FaReceipt, 
      label: 'Add Expense', 
      path: '/expenses',
      color: '#7C3AED'
    }
  ];

  const recentItems = [
    ...inventory.slice(0, 3).map(item => ({
      ...item,
      type: 'Product',
      icon: FaBoxes,
      color: '#059669'
    })),
    ...sales.slice(0, 2).map(sale => ({
      ...sale,
      type: 'Sale',
      icon: FaChartLine,
      color: '#EA580C'
    }))
  ].sort((a, b) => new Date(b.dateAdded || b.date) - new Date(a.dateAdded || a.date));

  return (
    <div className="mobile-dashboard">
      {/* Welcome Section */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h1 className="mobile-card-title">Welcome Back! 👋</h1>
          <p className="mobile-card-subtitle">Here's what's happening with your business today</p>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="mobile-summary-grid">
        {summaryItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="mobile-summary-item" style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)` }}>
              <div className="mobile-summary-icon">
                <Icon />
              </div>
              <div className="mobile-summary-value">{item.value}</div>
              <div className="mobile-summary-label">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h2 className="mobile-card-title">Quick Actions</h2>
          <p className="mobile-card-subtitle">Common tasks to get you started</p>
        </div>
        <div className="mobile-quick-actions">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="mobile-quick-action"
                style={{ '--action-color': action.color }}
                onClick={() => window.location.href = action.path}
              >
                <div className="mobile-quick-action-icon" style={{ color: action.color }}>
                  <Icon />
                </div>
                <span className="mobile-quick-action-label">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h2 className="mobile-card-title">Recent Activity</h2>
          <p className="mobile-card-subtitle">Latest updates in your business</p>
        </div>
        <div className="mobile-recent-list">
          {recentItems.length > 0 ? (
            recentItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="mobile-recent-item">
                  <div className="mobile-recent-icon" style={{ color: item.color }}>
                    <Icon />
                  </div>
                  <div className="mobile-recent-content">
                    <div className="mobile-recent-title">
                      {item.productName || item.customerName || 'Unknown'}
                    </div>
                    <div className="mobile-recent-subtitle">
                      {item.type} • {item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="mobile-recent-amount">
                    {item.finalPrice ? formatCurrency(item.finalPrice) : item.quantity || 'N/A'}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="mobile-empty-state">
              <div className="mobile-empty-icon">📊</div>
              <div className="mobile-empty-title">No Recent Activity</div>
              <div className="mobile-empty-description">Start by adding some products or recording sales</div>
            </div>
          )}
        </div>
      </div>

      {/* Business Overview */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h2 className="mobile-card-title">Business Overview</h2>
          <p className="mobile-card-subtitle">Key metrics and insights</p>
        </div>
        <div className="mobile-overview-stats">
          <div className="mobile-overview-stat">
            <div className="mobile-overview-label">Total Products</div>
            <div className="mobile-overview-value">{totalInventory}</div>
          </div>
          <div className="mobile-overview-stat">
            <div className="mobile-overview-label">Total Sales</div>
            <div className="mobile-overview-value">{totalSales}</div>
          </div>
          <div className="mobile-overview-stat">
            <div className="mobile-overview-label">Total Purchases</div>
            <div className="mobile-overview-value">{totalPurchases}</div>
          </div>
          <div className="mobile-overview-stat">
            <div className="mobile-overview-label">Total Partners</div>
            <div className="mobile-overview-value">{totalPartners}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileDashboard;
