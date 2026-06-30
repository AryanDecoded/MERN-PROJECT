const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/pantry',   require('./routes/pantryRoutes'));
app.use('/api/shopping', require('./routes/shoppingRoutes'));
app.use('/api/recipes',  require('./routes/recipeRoutes'));
app.use('/api/spending',  require('./routes/spendingRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Pantry Tracker API is running!' }));

// Cron Jobs (run every midnight)
const { checkExpiryAndNotify, checkLowStock } = require('./controllers/cronController');
cron.schedule('0 0 * * *', () => {
  console.log('Running midnight cron jobs...');
  checkExpiryAndNotify();
  checkLowStock();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
