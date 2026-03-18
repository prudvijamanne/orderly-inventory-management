const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/users.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ✅ Proper CORS (ONLY ONCE)
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
    "http://localhost:8080",
    "https://orderly-inventory-management-deploy-gyrkomkgz.vercel.app" // production
  ],
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Error handler (last)
app.use(errorHandler);

module.exports = app;