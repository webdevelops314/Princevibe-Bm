import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { FaUpload, FaDownload, FaDatabase, FaCheckCircle } from 'react-icons/fa';

function DataLoader() {
  const { dispatch } = useBusiness();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sample data based on your Excel structure
  const sampleProducts = [
    {
      productNo: 1,
      productName: "Black Aura Original",
      fullStock: 3,
      wholesalePrice: 3500,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 5500
    },
    {
      productNo: 2,
      productName: "Patek Philippe D.Watch Gold",
      fullStock: 1,
      wholesalePrice: 2300,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 4500
    },
    {
      productNo: 3,
      productName: "Patek Philippe D.Watch Silver",
      fullStock: 1,
      wholesalePrice: 2300,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 4500
    },
    {
      productNo: 4,
      productName: "Hublot Classic Quartz Watch",
      fullStock: 2,
      wholesalePrice: 2000,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 4500
    },
    {
      productNo: 5,
      productName: "Rolex DayDate Watches",
      fullStock: 3,
      wholesalePrice: 2100,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 4500
    },
    {
      productNo: 6,
      productName: "Patek Philippe Black Watch",
      fullStock: 1,
      wholesalePrice: 2500,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 5000
    },
    {
      productNo: 7,
      productName: "Patek Philippe Brown Watch",
      fullStock: 1,
      wholesalePrice: 2500,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 5000
    },
    {
      productNo: 8,
      productName: "Black Arabic Aura Fiber Watch OLD",
      fullStock: 3,
      wholesalePrice: 900,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 2300
    },
    {
      productNo: 9,
      productName: "Black Arabic Aura Fiber Watch NEW",
      fullStock: 15,
      wholesalePrice: 550,
      boxPrice: 250,
      marketingCost: 500,
      deliveryCost: 150,
      finalPrice: 2300
    },
    {
      productNo: 10,
      productName: "Black Arabic Aura (white dial)",
      fullStock: 10,
      wholesalePrice: 600,
      boxPrice: 250,
      marketingCost: 250,
      deliveryCost: 150,
      finalPrice: 2300
    },
    {
      productNo: 11,
      productName: "Black Aura Fiber (Variants)",
      fullStock: 5,
      wholesalePrice: 700,
      boxPrice: 250,
      marketingCost: 250,
      deliveryCost: 150,
      finalPrice: 2300
    }
  ];

  // Orders data from your Excel sheet
  const sampleOrders = [
    {
      orderNo: 1,
      productName: "Original Black Aura Watch",
      customerName: "Shahid Zafar",
      phoneNo: "0300-5211555",
      emailAddress: "shahidzafar.4you@gmail.com",
      shippingAddress: "NAG, Karianwala Gujrat, Punjab 50830",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 7000,
      expenses: 900,
      totalRevenue: 7000,
      wholesalePrice: 3500,
      totalProfit: 2600
    },
    {
      orderNo: 2,
      productName: "Patek Phillipe Diamond (Gold)",
      customerName: "Muhammad Farhan",
      phoneNo: "0307-6817272",
      emailAddress: "arhamluqman2211@gmail.com",
      shippingAddress: "Qaiser PCO, Karianwala, Gujrat, Punjab",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 5000,
      expenses: 900,
      totalRevenue: 5000,
      wholesalePrice: 2300,
      totalProfit: 1800
    },
    {
      orderNo: 3,
      productName: "Black Arabic Aura Fiber (Black)",
      customerName: "Muhammad Akhyar",
      phoneNo: "0326-1502830",
      emailAddress: "arhamluqman2211@gmail.com",
      shippingAddress: "Kainat Studio, Karianwala, Gujrat, Punjab",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 2300,
      expenses: 900,
      totalRevenue: 2300,
      wholesalePrice: 550,
      totalProfit: 850
    },
    {
      orderNo: 4,
      productName: "Original Black Aura Watch",
      customerName: "Shahid Ali",
      phoneNo: "0306-5903080",
      emailAddress: "shahid24648@gmail.com",
      shippingAddress: "Amir Studio, Karianwala, Gujrat, Punjab",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 5500,
      expenses: 900,
      totalRevenue: 5500,
      wholesalePrice: 3500,
      totalProfit: 1100
    },
    {
      orderNo: 5,
      productName: "Black Arabic Aura Fiber (Black)",
      customerName: "Hammad Ashraf",
      phoneNo: "0302-0723311",
      emailAddress: "hammadashraf058@gmail.com",
      shippingAddress: "UBL Bank Karianwala, Gujrat, Punjab",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 2300,
      expenses: 900,
      totalRevenue: 2300,
      wholesalePrice: 900,
      totalProfit: 500
    },
    {
      orderNo: 6,
      productName: "Black Arabic Aura Fiber (Black)",
      customerName: "Sahil Ijaz",
      phoneNo: "0302-4891399",
      emailAddress: "hssahil2913@gmail.com",
      shippingAddress: "Karianwala Gujrat, Punjab 50835",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 2300,
      expenses: 900,
      totalRevenue: 2300,
      wholesalePrice: 700,
      totalProfit: 700
    },
    {
      orderNo: 7,
      productName: "Black Aura Fiber (White & Red)",
      customerName: "Abdul Rehman",
      phoneNo: "0324-8778329",
      emailAddress: "hssahil2913@gmail.com",
      shippingAddress: "Karianwala Gujrat, Punjab 50836",
      paymentMethod: "Cash On Delivery",
      quantity: 1,
      sellingPrice: 2300,
      expenses: 900,
      totalRevenue: 2300,
      wholesalePrice: 700,
      totalProfit: 700
    }
  ];

  const loadSampleData = async () => {
    setIsLoading(true);
    setMessage('Loading sample data...');
    
    try {
      // Clear existing data
      dispatch({ type: 'SET_INVENTORY', payload: [] });
      dispatch({ type: 'SET_SALES', payload: [] });
      
      // Add each product
      for (const product of sampleProducts) {
        dispatch({
          type: 'ADD_INVENTORY_ITEM',
          payload: {
            ...product,
            _id: Date.now().toString() + Math.random(),
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            costPrice: product.wholesalePrice + product.boxPrice,
            totalExpenses: product.marketingCost + product.deliveryCost,
            totalCost: product.wholesalePrice + product.boxPrice + product.marketingCost + product.deliveryCost,
            profit: product.finalPrice - (product.wholesalePrice + product.boxPrice + product.marketingCost + product.deliveryCost),
            profitPercentage: ((product.wholesalePrice + product.boxPrice + product.marketingCost + product.deliveryCost) > 0) ? 
              ((product.finalPrice - (product.wholesalePrice + product.boxPrice + product.marketingCost + product.deliveryCost)) / 
               (product.wholesalePrice + product.boxPrice + product.marketingCost + product.deliveryCost)) * 100 : 0
          }
        });
      }
      
      // Add each sale
      for (const order of sampleOrders) {
        dispatch({
          type: 'ADD_SALE',
          payload: {
            ...order,
            _id: Date.now().toString() + Math.random(),
            date: new Date().toISOString(),
            productId: sampleProducts.find(p => p.productName === order.productName)?._id || '',
            // Calculate actual profit from this specific sale
            actualProfit: order.totalProfit,
            actualProfitPercentage: order.wholesalePrice > 0 ? (order.totalProfit / order.wholesalePrice) * 100 : 0
          }
        });
      }
      
      setMessage('✅ Sample data loaded successfully! 11 products and 7 sales added.');
    } catch (error) {
      setMessage('❌ Error loading sample data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    try {
      const data = {
        products: sampleProducts,
        orders: sampleOrders
      };
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'princevibe-business-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('✅ Data exported successfully!');
    } catch (error) {
      setMessage('❌ Error exporting data: ' + error.message);
    }
  };

  return (
    <div className="data-loader">
      <div className="loader-header">
        <h2>
          <FaDatabase className="header-icon" />
          Data Management
        </h2>
        <p>Load your Excel data or export current data</p>
      </div>

      <div className="loader-actions">
        <div className="action-card">
          <div className="action-icon">
            <FaUpload />
          </div>
          <div className="action-content">
            <h3>Load Sample Data</h3>
            <p>Load the sample data based on your Excel structure</p>
            <button 
              className="btn btn-primary" 
              onClick={loadSampleData}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Sample Data'}
            </button>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <FaDownload />
          </div>
          <div className="action-content">
            <h3>Export Data</h3>
            <p>Export current business data as JSON</p>
            <button className="btn btn-secondary" onClick={exportData}>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
          <FaCheckCircle className="message-icon" />
          <span>{message}</span>
        </div>
      )}

      <div className="data-preview">
        <h3>Sample Data Structure</h3>
        <p>This matches your Excel sheet structure:</p>
        
        <div className="preview-section">
          <h4>Products (11 items)</h4>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>Product No.</th>
                  <th>Product Name</th>
                  <th>Full Stock</th>
                  <th>Wholesale</th>
                  <th>Box Price</th>
                  <th>Marketing</th>
                  <th>Delivery</th>
                  <th>Final Price</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.slice(0, 5).map(product => (
                  <tr key={product.productNo}>
                    <td>{product.productNo}</td>
                    <td>{product.productName}</td>
                    <td>{product.fullStock}</td>
                    <td>{product.wholesalePrice}</td>
                    <td>{product.boxPrice}</td>
                    <td>{product.marketingCost}</td>
                    <td>{product.deliveryCost}</td>
                    <td>{product.finalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="preview-note">Showing first 5 of 11 products...</p>
          </div>
        </div>

        <div className="preview-section">
          <h4>Orders & Sales (7 transactions)</h4>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Selling Price</th>
                  <th>Wholesale</th>
                  <th>Expenses</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {sampleOrders.slice(0, 5).map(order => (
                  <tr key={order.orderNo}>
                    <td>{order.orderNo}</td>
                    <td>{order.productName}</td>
                    <td>{order.customerName}</td>
                    <td>{order.sellingPrice}</td>
                    <td>{order.wholesalePrice}</td>
                    <td>{order.expenses}</td>
                    <td>{order.totalProfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="preview-note">Showing first 5 of 7 orders...</p>
          </div>
        </div>

        <div className="profit-summary">
          <h4>Profit Analysis Summary</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Total Revenue:</span>
              <span className="value">PKR {sampleOrders.reduce((sum, order) => sum + order.totalRevenue, 0)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Profit:</span>
              <span className="value profit">PKR {sampleOrders.reduce((sum, order) => sum + order.totalProfit, 0)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Average Profit per Sale:</span>
              <span className="value">PKR {(sampleOrders.reduce((sum, order) => sum + order.totalProfit, 0) / sampleOrders.length).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataLoader;
