import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaChartBar,
  FaBoxes,
  FaReceipt,
  FaUsers,
  FaCalculator
} from 'react-icons/fa';

function ProfitLoss() {
  const { inventory, sales, expenses, partners, settings } = useBusiness();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date(0); // Beginning of time
    let endDate = new Date();

    switch (selectedPeriod) {
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        }
        break;
      default:
        break;
    }

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    return { sales: filteredSales, expenses: filteredExpenses };
  };

  const { sales: filteredSales, expenses: filteredExpenses } = getFilteredData();

  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    // Total Revenue from Sales
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
    
    // Total Cost of Goods Sold (from sales data)
    const totalCostOfGoods = filteredSales.reduce((sum, sale) => {
      return sum + (sale.wholesalePrice * sale.quantity);
    }, 0);
    
    // Total Operating Expenses
    const totalOperatingExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Additional expenses from sales (marketing, delivery, etc.)
    const totalSalesExpenses = filteredSales.reduce((sum, sale) => sum + sale.expenses, 0);
    
    // Total Expenses
    const totalExpenses = totalOperatingExpenses + totalSalesExpenses;
    
    // Gross Profit
    const grossProfit = totalRevenue - totalCostOfGoods;
    
    // Net Profit
    const netProfit = grossProfit - totalExpenses;
    
    // Profit Margin
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    // Gross Profit Margin
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCostOfGoods,
      totalOperatingExpenses,
      totalSalesExpenses,
      totalExpenses,
      grossProfit,
      netProfit,
      profitMargin,
      grossProfitMargin
    };
  };

  const metrics = calculateFinancialMetrics();

  // Top performing products
  const getTopProducts = () => {
    const productPerformance = {};
    
    filteredSales.forEach(sale => {
      if (!productPerformance[sale.productName]) {
        productPerformance[sale.productName] = {
          revenue: 0,
          profit: 0,
          quantity: 0,
          sales: 0
        };
      }
      
      productPerformance[sale.productName].revenue += sale.totalRevenue;
      productPerformance[sale.productName].profit += sale.totalProfit;
      productPerformance[sale.productName].quantity += sale.quantity;
      productPerformance[sale.productName].sales += 1;
    });

    return Object.entries(productPerformance)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  // Expense breakdown
  const getExpenseBreakdown = () => {
    const breakdown = {};
    
    filteredExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!breakdown[category]) {
        breakdown[category] = 0;
      }
      breakdown[category] += expense.amount;
    });

    // Add sales expenses
    if (metrics.totalSalesExpenses > 0) {
      breakdown['Sales Expenses'] = metrics.totalSalesExpenses;
    }

    return Object.entries(breakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const expenseBreakdown = getExpenseBreakdown();

  // Partner distribution calculation
  const calculatePartnerDistribution = () => {
    if (!partners || partners.length === 0) return null;
    
    const totalProfit = metrics.netProfit;
    const reinvestmentPercentage = settings?.reinvestmentPercentage || 70;
    const distributionPercentage = 100 - reinvestmentPercentage;
    
    const amountForDistribution = totalProfit * (distributionPercentage / 100);
    const amountForReinvestment = totalProfit * (reinvestmentPercentage / 100);
    
    const partnerShare = amountForDistribution / partners.length;
    
    return {
      totalProfit,
      reinvestmentPercentage,
      distributionPercentage,
      amountForDistribution,
      amountForReinvestment,
      partnerShare,
      partners: partners.map(partner => ({
        ...partner,
        share: partnerShare
      }))
    };
  };

  const partnerDistribution = calculatePartnerDistribution();

  return (
    <div className="profit-loss-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FaChartLine className="page-icon" />
            Profit & Loss Analysis
          </h1>
          <p className="page-subtitle">Comprehensive financial analysis and business performance insights</p>
        </div>
        
        <div className="period-selector">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          {selectedPeriod === 'custom' && (
            <div className="custom-date-inputs">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="date-input"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="date-input"
                placeholder="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <FaDollarSign />
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="metric-trend">
              <FaArrowUp className="trend-icon" />
              <span>Revenue</span>
            </div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <FaChartLine />
          </div>
          <div className="metric-content">
            <div className="metric-label">Gross Profit</div>
            <div className="metric-value">{formatCurrency(metrics.grossProfit)}</div>
            <div className="metric-subtitle">
              {metrics.grossProfitMargin.toFixed(1)}% Margin
            </div>
          </div>
        </div>

        <div className="metric-card profit">
          <div className="metric-icon">
            <FaCalculator />
          </div>
          <div className="metric-content">
            <div className="metric-label">Net Profit</div>
            <div className="metric-value">{formatCurrency(metrics.netProfit)}</div>
            <div className="metric-subtitle">
              {metrics.profitMargin.toFixed(1)}% Margin
            </div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <FaReceipt />
          </div>
          <div className="metric-content">
            <div className="metric-label">Total Expenses</div>
            <div className="metric-value">{formatCurrency(metrics.totalExpenses)}</div>
            <div className="metric-subtitle">
              Operating + Sales
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="financial-breakdown">
        <div className="breakdown-section">
          <h3>Revenue & Cost Analysis</h3>
          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span className="breakdown-label">Total Revenue:</span>
              <span className="breakdown-value revenue">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Cost of Goods Sold:</span>
              <span className="breakdown-value cost">{formatCurrency(metrics.totalCostOfGoods)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Gross Profit:</span>
              <span className="breakdown-value profit">{formatCurrency(metrics.grossProfit)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Operating Expenses:</span>
              <span className="breakdown-value expense">{formatCurrency(metrics.totalOperatingExpenses)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Sales Expenses:</span>
              <span className="breakdown-value expense">{formatCurrency(metrics.totalSalesExpenses)}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Total Expenses:</span>
              <span className="breakdown-value expense">{formatCurrency(metrics.totalExpenses)}</span>
            </div>
            <div className="breakdown-item total">
              <span className="breakdown-label">Net Profit:</span>
              <span className={`breakdown-value ${metrics.netProfit >= 0 ? 'profit' : 'loss'}`}>
                {formatCurrency(metrics.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Partner Distribution */}
        {partnerDistribution && (
          <div className="breakdown-section">
            <h3>Partner Distribution</h3>
            <div className="partner-distribution">
              <div className="distribution-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Profit:</span>
                  <span className="summary-value">{formatCurrency(partnerDistribution.totalProfit)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Reinvestment (70%):</span>
                  <span className="summary-value reinvestment">{formatCurrency(partnerDistribution.amountForReinvestment)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Distribution (30%):</span>
                  <span className="summary-value distribution">{formatCurrency(partnerDistribution.amountForDistribution)}</span>
                </div>
              </div>
              
              <div className="partner-shares">
                <h4>Individual Partner Shares</h4>
                <div className="partner-grid">
                  {partnerDistribution.partners.map(partner => (
                    <div key={partner._id} className="partner-share">
                      <div className="partner-name">{partner.name}</div>
                      <div className="partner-amount">{formatCurrency(partner.share)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Products Performance */}
      <div className="performance-section">
        <h3>Top Performing Products</h3>
        <div className="product-performance">
          {topProducts.map((product, index) => (
            <div key={product.name} className="product-card">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-meta">
                  <span className="meta-item">Sales: {product.sales}</span>
                  <span className="meta-item">Qty: {product.quantity}</span>
                </div>
              </div>
              <div className="product-financials">
                <div className="financial-item">
                  <span className="label">Revenue:</span>
                  <span className="value">{formatCurrency(product.revenue)}</span>
                </div>
                <div className="financial-item">
                  <span className="label">Profit:</span>
                  <span className={`value ${product.profit >= 0 ? 'profit' : 'loss'}`}>
                    {formatCurrency(product.profit)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Analysis */}
      <div className="expense-analysis">
        <h3>Expense Breakdown</h3>
        <div className="expense-chart">
          {expenseBreakdown.map((item, index) => (
            <div key={item.category} className="expense-item">
              <div className="expense-header">
                <span className="expense-category">{item.category}</span>
                <span className="expense-amount">{formatCurrency(item.amount)}</span>
              </div>
              <div className="expense-bar">
                <div 
                  className="expense-bar-fill"
                  style={{ 
                    width: `${(item.amount / Math.max(...expenseBreakdown.map(e => e.amount))) * 100}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h4>Period Summary</h4>
          <div className="summary-content">
            <p><strong>Period:</strong> {periods.find(p => p.value === selectedPeriod)?.label}</p>
            <p><strong>Total Sales:</strong> {filteredSales.length}</p>
            <p><strong>Total Expenses:</strong> {filteredExpenses.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <h4>Performance Indicators</h4>
          <div className="summary-content">
            <p><strong>Profit Margin:</strong> {metrics.profitMargin.toFixed(1)}%</p>
            <p><strong>Gross Margin:</strong> {metrics.grossProfitMargin.toFixed(1)}%</p>
            <p><strong>Revenue per Sale:</strong> {filteredSales.length > 0 ? formatCurrency(metrics.totalRevenue / filteredSales.length) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitLoss;
