// backend\index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();  // Load environment variables from .env file
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//Routes
const authRoutes = require('./routes/auth');

const workOrdersRoute = require('./routes/workOrders');

const preventiveMaintenanceRoutes = require('./routes/preventiveMaintenanceRoutes');

const assetRoutes = require('./routes/assetRoutes');

const requestRoutes = require('./routes/requests');
 
// Routes
app.use('/api/auth', authRoutes);

app.use('/api/workorders', workOrdersRoute);

app.use('/api/preventivemaintenance', preventiveMaintenanceRoutes);

app.use('/api/assets', assetRoutes);

app.use('/api/requests', requestRoutes);


// Connect to MongoDB using the correct environment variable name
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
