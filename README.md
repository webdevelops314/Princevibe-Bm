# PrinceVibe Business Manager 🚀

A comprehensive business management system built with React frontend and Node.js backend, designed specifically for e-commerce businesses to manage inventory, sales, expenses, and partner distributions.

## ✨ Features

- **📦 Inventory Management**: Track products, wholesale prices, expenses, and profit margins
- **💰 Sales Tracking**: Monitor customer orders, revenue, and per-sale profit calculations
- **📊 Profit & Loss Analysis**: Comprehensive financial reporting with partner distribution
- **🤝 Partner Management**: Manage business partners with profit sharing calculations
- **💸 Expense Tracking**: Categorize and monitor business expenses
- **🔄 Data Persistence**: MongoDB Atlas integration for reliable data storage
- **📱 Responsive Design**: Modern, mobile-friendly interface

## 🏗️ Architecture

- **Frontend**: React.js with Context API for state management
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (cloud-hosted)
- **API**: RESTful API with full CRUD operations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd princevibe-business-manager
```

### 2. Install Dependencies

#### Option A: Automatic (Windows)
```bash
install-backend.bat
```

#### Option B: Manual
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=princevibebm
PORT=5000
```

### 4. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start backend
npm start
```

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📊 API Endpoints

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create new purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Partners
- `GET /api/partners` - Get all partners
- `POST /api/partners` - Create new partner
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

### Settings
- `GET /api/settings` - Get business settings
- `PUT /api/settings/:id` - Update business settings

### Data Migration
- `POST /api/migrate` - Migrate data from localStorage to MongoDB

## 🔄 Data Migration

The application automatically detects existing localStorage data and provides migration options:

1. **Automatic Migration**: Data is automatically migrated when the backend is available
2. **Manual Migration**: Use the `migrateToDatabase()` function in the context
3. **Fallback**: Application gracefully falls back to localStorage if backend is unavailable

## 🗄️ Database Schema

### Inventory
- `productNo` (Number, unique)
- `productName` (String)
- `fullStock` (Number)
- `wholesalePrice` (Number)
- `boxPrice` (Number)
- `marketingCost` (Number)
- `deliveryCost` (Number)
- `finalPrice` (Number)
- `costPrice` (Number, calculated)
- `totalExpenses` (Number, calculated)
- `totalCost` (Number, calculated)
- `profit` (Number, calculated)
- `profitPercentage` (Number, calculated)

### Sales
- `orderNo` (Number, unique)
- `productName` (String)
- `customerName` (String)
- `phoneNo` (String)
- `emailAddress` (String)
- `shippingAddress` (String)
- `paymentMethod` (String)
- `quantity` (Number)
- `sellingPrice` (Number)
- `expenses` (Number)
- `totalRevenue` (Number, calculated)
- `wholesalePrice` (Number)
- `totalProfit` (Number, calculated)
- `profitMargin` (Number, calculated)
- `costOfGoods` (Number, calculated)

## 🎯 Business Logic

### Profit Calculations
- **Total Cost**: Wholesale Price + Box Price + Marketing Cost + Delivery Cost
- **Profit**: Final Price - Total Cost
- **Profit Percentage**: (Profit / Total Cost) × 100

### Partner Distribution
- **Reinvestment**: 70% of net profit (configurable)
- **Partner Share**: Remaining 30% distributed based on partner shares
- **Equal Distribution**: Default 50/50 split between partners

## 🛠️ Development

### Project Structure
```
princevibe-business-manager/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # Business context
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
├── server.js              # Backend server
├── package.json           # Backend dependencies
├── config.env             # Environment variables
└── README.md              # This file
```

### Adding New Features
1. Create backend API endpoint in `server.js`
2. Add corresponding method in `client/src/services/apiService.js`
3. Update business context if needed
4. Create React component in `client/src/components/`

## 🚀 Deployment

### Heroku
```bash
# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set DB_NAME=your_database_name

# Deploy
git push heroku main
```

### Vercel/Netlify
1. Build the frontend: `npm run build`
2. Deploy the `client/build` folder
3. Deploy backend separately (e.g., Heroku, Railway)

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string in `.env`
   - Ensure IP whitelist includes your current IP
   - Verify username/password

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `npx kill-port 5000`

3. **CORS Issues**
   - Backend includes CORS middleware
   - Check if frontend proxy is set correctly

4. **Data Not Persisting**
   - Check MongoDB connection status
   - Verify API endpoints are working
   - Check browser console for errors

### Debug Mode
```bash
# Backend with detailed logging
DEBUG=* npm run server

# Frontend with React DevTools
npm run client
```

## 📈 Performance

- **Database Indexing**: Automatic indexing on frequently queried fields
- **API Caching**: Implement Redis for production caching
- **Frontend Optimization**: React.memo and useMemo for expensive calculations
- **Bundle Size**: Code splitting and lazy loading for large components

## 🔒 Security

- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper CORS setup for production
- **Environment Variables**: Secure credential management
- **MongoDB Security**: Network access control and authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: [Your Contact Information]

---

**Built with ❤️ for PrinceVibe Business Success**
