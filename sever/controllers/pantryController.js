const PantryItem = require('../models/PantryItem');

// GET /api/pantry  — get all items for the logged-in user
const getAllItems = async (req, res) => {
  try {
    const items = await PantryItem.find({ userId: req.user.id }).sort({ expiryDate: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/pantry/:id  — get a single item
const getItemById = async (req, res) => {
  try {
    const item = await PantryItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/pantry  — add a new pantry item
const addItem = async (req, res) => {
  const { name, quantity, unit, category, purchaseDate, expiryDate, minThreshold, cost } = req.body;

  try {
    const item = await PantryItem.create({
      userId: req.user.id,
      name,
      quantity,
      unit,
      category,
      purchaseDate,
      expiryDate,
      minThreshold,
      cost,
    });
    res.status(201).json({ message: 'Item added', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/pantry/:id  — update an item (full edit)
const updateItem = async (req, res) => {
  try {
    const item = await PantryItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true } // return the updated document
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH /api/pantry/:id/quantity  — just update the quantity (e.g. after consuming)
const updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  try {
    const item = await PantryItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { quantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Quantity updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/pantry/:id  — remove an item
const deleteItem = async (req, res) => {
  try {
    const item = await PantryItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/pantry/summary  — counts for dashboard cards
const getSummary = async (req, res) => {
  try {
    const today = new Date();
    const in3Days = new Date();
    in3Days.setDate(today.getDate() + 3);

    const total = await PantryItem.countDocuments({ userId: req.user.id });
    const expiringSoon = await PantryItem.countDocuments({
      userId: req.user.id,
      expiryDate: { $gte: today, $lte: in3Days },
    });
    const expired = await PantryItem.countDocuments({
      userId: req.user.id,
      expiryDate: { $lt: today },
    });

    res.json({ total, expiringSoon, expired });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllItems, getItemById, addItem, updateItem, updateQuantity, deleteItem, getSummary };
