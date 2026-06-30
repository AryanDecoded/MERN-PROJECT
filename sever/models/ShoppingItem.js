const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    enum: ['kg', 'L', 'pcs', 'g', 'ml', 'pack'],
    default: 'pcs',
  },
  // true = cron added it because stock was low, false = user added manually
  autoAdded: {
    type: Boolean,
    default: false,
  },
  // Link to the pantry item so we can update its quantity when checked off
  pantryItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PantryItem',
    default: null,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('ShoppingItem', shoppingItemSchema);
