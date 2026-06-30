const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'L', 'pcs', 'g', 'ml', 'pack'],
    default: 'pcs',
  },
  category: {
    type: String,
    enum: ['Dairy', 'Vegetables', 'Fruits', 'Grains', 'Meat', 'Snacks', 'Beverages', 'Other'],
    default: 'Other',
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  // Minimum quantity before auto-adding to shopping list
  minThreshold: {
    type: Number,
    default: 1,
  },
  // Cost of this item when purchased
  cost: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('PantryItem', pantryItemSchema);
