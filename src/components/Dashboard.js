import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency } from '../utils/formatters';
import { 
  FaHome, 
  FaBoxes, 
  FaShoppingCart, 
  FaReceipt,
  FaDollarSign,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaChartPie,
  FaUsers,
  FaCog
} from 'react-icons/fa';

function Dashboard() {
  const { 
    inventory, 
    purchases, 
    sales, 
    expenses,
    calculateTotalSales,
    calculateTotalPurchases,
    calculateTotalExpenses,
    calculateGrossProfit,
    calculateNetProfit,
    calculateReinvestmentAmount,
    calculatePartnerDistribution
  } = useBusiness();

  const totalSales = calculateTotalSales();
  const totalPurchases = calculateTotalPurchases();
  const totalExpenses = calculateTotalExpenses();
  const grossProfit = calculateGrossProfit();
  const netProfit = calculateNetProfit();
  const reinvestmentAmount = calculateReinvestmentAmount();
  const partnerDistribution = calculatePartnerDistribution();

  // Get low stock items (less than 5 items)
  const lowStockItems = inventory.filter(item => item.quantity < 5);
  
  // Get recent activity (last 5 items)
  const recentActivity = [
    ...sales.slice(-3).map(sale => ({ ...sale, type: 'sale', icon: FaChartLine, color: '#EA580C' })),
    ...purchases.slice(-3).map(purchase => ({ ...purchase, type: 'purchase', icon: FaShoppingCart, color: '#DC2626' })),
    ...expenses.slice(-3).map(expense => ({ ...expense, type: 'expense', icon: FaReceipt, color: '#7C3AED' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <h1 className="page-title">Business Dashboard</h1>
        <p className="page-subtitle">Overview of your business performance and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card metric-sales">
          <div className="metric-icon">
            <FaArrowUp />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(totalSales)}</div>
            <div className="metric-label">Total Sales</div>
            <div className="metric-change positive">
              <FaArrowUp /> Revenue
            </div>
          </div>
        </div>

        <div className="metric-card metric-purchases">
          <div className="metric-icon">
            <FaArrowDown />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(totalPurchases)}</div>
            <div className="metric-label">Total Purchases</div>
            <div className="metric-change negative">
              <FaArrowDown /> Cost
            </div>
          </div>
        </div>

        <div className="metric-card metric-profit">
          <div className="metric-icon">
            <FaChartLine />
          </div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(netProfit)}</div>
            <div className="metric-label">Net Profit</div>
            <div className={`metric-change ${netProfit >= 0 ? 'positive' : 'negative'}`}>
              {netProfit >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              {netProfit >= 0 ? 'Profit' : 'Loss'}
            </div>
          </div>
        </div>

        <div className="metric-card metric-inventory">
          <div className="metric-icon">
            <FaBoxes />
          </div>
          <div className="metric-content">
            <div className="metric-value">{inventory.length}</div>
            <div className="metric-label">Products</div>
            <div className="metric-change neutral">
              <FaCog /> Updated
            </div>
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div className="card profit-summary-card">
        <div className="card-header">
          <h2 className="card-title">Profit Analysis</h2>
        </div>
        <div className="profit-breakdown">
          <div className="profit-item">
            <div className="profit-label">Gross Profit</div>
            <div className="profit-value positive">{formatCurrency(grossProfit)}</div>
            <div className="profit-bar">
              <div 
                className="profit-bar-fill positive" 
                style={{ width: `${Math.min((grossProfit / totalSales) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="profit-item">
            <div className="profit-label">Total Expenses</div>
            <div className="profit-value negative">{formatCurrency(totalExpenses)}</div>
            <div className="profit-bar">
              <div 
                className="profit-bar-fill negative" 
                style={{ width: `${Math.min((totalExpenses / totalSales) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="profit-item">
            <div className="profit-label">Net Profit</div>
            <div className="profit-value positive">{formatCurrency(netProfit)}</div>
            <div className="profit-bar">
              <div 
                className="profit-bar-fill positive" 
                style={{ width: `${Math.min((netProfit / totalSales) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Distribution & Reinvestment */}
      <div className="summary-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Partner Distribution</h2>
          </div>
          {partnerDistribution.length > 0 ? (
            <div className="partner-distribution">
              {partnerDistribution.map(partner => (
                <div key={partner.id} className="partner-item">
                  <div className="partner-info">
                    <div className="partner-name">{partner.name}</div>
                    <div className="partner-share">{partner.share}%</div>
                  </div>
                  <div className="partner-amount positive">{formatCurrency(partner.amount)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No partners configured yet.</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Reinvestment</h2>
          </div>
          <div className="reinvestment-info">
            <div className="reinvestment-amount">{formatCurrency(reinvestmentAmount)}</div>
            <div className="reinvestment-label">70% of Net Profit</div>
            <div className="reinvestment-description">
              Automatically reinvested in new inventory
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="summary-grid">
        {/* Low Stock Alerts */}
        <div className="card alert-card">
          <div className="card-header">
            <h2 className="card-title">
              <FaExclamationTriangle className="alert-icon" />
              Low Stock Alerts
            </h2>
          </div>
          {lowStockItems.length > 0 ? (
            <div className="alert-list">
              {lowStockItems.map(item => (
                <div key={item.id} className="alert-item">
                  <div className="alert-content">
                    <div className="alert-title">{item.name}</div>
                    <div className="alert-description">
                      Only {item.quantity} items remaining
                    </div>
                  </div>
                  <div className="alert-status urgent">Urgent</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">All products have sufficient stock.</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card activity-card">
          <div className="card-header">
            <h2 className="card-title">
              <FaCog className="activity-icon" />
              Recent Activity
            </h2>
          </div>
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon" style={{ color: activity.color }}>
                      <Icon />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        {activity.type === 'sale' ? 'Sale' : 
                         activity.type === 'purchase' ? 'Purchase' : 'Expense'}
                      </div>
                      <div className="activity-description">
                        {activity.type === 'sale' ? `${activity.productName} - ${formatCurrency(activity.finalPrice)}` :
                         activity.type === 'purchase' ? `${activity.productName} - ${formatCurrency(activity.totalCost)}` :
                         `${activity.category} - ${formatCurrency(activity.amount)}`}
                      </div>
                      <div className="activity-time">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
