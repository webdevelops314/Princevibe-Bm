const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: './config.env' });

// Fallback environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('💡 Please check your config.env file');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
console.log('🔗 Attempting to connect to MongoDB...');
console.log('📡 Connection string:', mongoURI ? mongoURI.substring(0, 50) + '...' : 'Not found');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!');
  console.log('🗄️ Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 Please check your connection string and network access');
});

// Define Schemas
const inventorySchema = new mongoose.Schema({
  productNo: { type: Number, required: true, unique: true },
  productName: { type: String, required: true },
  fullStock: { type: Number, required: true, default: 0 },
  wholesalePrice: { type: Number, required: true, default: 0 },
  boxPrice: { type: Number, required: true, default: 0 },
  marketingCost: { type: Number, required: true, default: 0 },
  deliveryCost: { type: Number, required: true, default: 0 },
  finalPrice: { type: Number, required: true, default: 0 },
  costPrice: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  profitPercentage: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const saleSchema = new mongoose.Schema({
  orderNo: { type: Number, required: true, unique: true },
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNo: { type: String, required: true },
  emailAddress: { type: String },
  shippingAddress: { type: String },
  paymentMethod: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  sellingPrice: { type: Number, required: true, default: 0 },
  expenses: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  wholesalePrice: { type: Number, required: true, default: 0 },
  totalProfit: { type: Number, default: 0 },
  profitMargin: { type: Number, default: 0 },
  costOfGoods: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const purchaseSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  supplier: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitCost: { type: Number, required: true, default: 0 },
  totalCost: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  share: { type: Number, required: true, default: 50 },
  email: { type: String },
  phone: { type: String },
  notes: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  reinvestmentPercentage: { type: Number, default: 70 },
  currency: { type: String, default: 'PKR' },
  businessName: { type: String, default: 'PrinceVibe Business Manager' },
  taxRate: { type: Number, default: 0 }
});

// Create Models
const Inventory = mongoose.model('Inventory', inventorySchema);
const Sale = mongoose.model('Sale', saleSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Partner = mongoose.model('Partner', partnerSchema);
const Settings = mongoose.model('Settings', settingsSchema);

// API Routes

// Inventory Routes
app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ productNo: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sales Routes
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const newSale = new Sale(req.body);
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/sales/:id', async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Purchases Routes
app.get('/api/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/purchases/:id', async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/purchases/:id', async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Expenses Routes
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Partners Routes
app.get('/api/partners', async (req, res) => {
  try {
    const partners = await Partner.find().sort({ dateAdded: 1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/partners', async (req, res) => {
  try {
    const newPartner = new Partner(req.body);
    await newPartner.save();
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/partners/:id', async (req, res) => {
  try {
    const updatedPartner = await Partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/partners/:id', async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Settings Routes
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings/:id', async (req, res) => {
  try {
    const updatedSettings = await Settings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Data Migration Route (from localStorage to MongoDB)
app.post('/api/migrate', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Clear existing data
    await Inventory.deleteMany({});
    await Sale.deleteMany({});
    await Purchase.deleteMany({});
    await Expense.deleteMany({});
    await Partner.deleteMany({});
    
    // Migrate inventory
    if (data.inventory && data.inventory.length > 0) {
      for (const item of data.inventory) {
        const newItem = new Inventory(item);
        await newItem.save();
      }
    }
    
    // Migrate sales
    if (data.sales && data.sales.length > 0) {
      for (const sale of data.sales) {
        const newSale = new Sale(sale);
        await newSale.save();
      }
    }
    
    // Migrate purchases
    if (data.purchases && data.purchases.length > 0) {
      for (const purchase of data.purchases) {
        const newPurchase = new Purchase(purchase);
        await newPurchase.save();
      }
    }
    
    // Migrate expenses
    if (data.expenses && data.expenses.length > 0) {
      for (const expense of data.expenses) {
        const newExpense = new Expense(expense);
        await newExpense.save();
      }
    }
    
    // Migrate partners
    if (data.partners && data.partners.length > 0) {
      for (const partner of data.partners) {
        const newPartner = new Partner(partner);
        await newPartner.save();
      }
    }
    
    res.json({ message: 'Data migrated successfully to MongoDB' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PrinceVibe Business Manager API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});
