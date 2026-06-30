const ShoppingItem = require('../models/ShoppingItem');
const PantryItem = require('../models/PantryItem');

// GET /api/shopping  — get all pending shopping items
const getShoppingList = async (req, res) => {
  try {
    const items = await ShoppingItem.find({ userId: req.user.id, isChecked: false });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/shopping  — manually add an item to the shopping list
const addShoppingItem = async (req, res) => {
  const { name, quantity, unit } = req.body;
  try {
    const item = await ShoppingItem.create({
      userId: req.user.id,
      name,
      quantity,
      unit,
      autoAdded: false,
    });
    res.status(201).json({ message: 'Shopping item added', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH /api/shopping/:id  — check off an item (and bump pantry quantity)
const checkOffItem = async (req, res) => {
  try {
    const shoppingItem = await ShoppingItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!shoppingItem) return res.status(404).json({ message: 'Shopping item not found' });

    // Mark as checked
    shoppingItem.isChecked = true;
    await shoppingItem.save();

    // If this item is linked to a pantry item, update its quantity
    if (shoppingItem.pantryItemId) {
      await PantryItem.findByIdAndUpdate(
        shoppingItem.pantryItemId,
        { $inc: { quantity: shoppingItem.quantity } } // increment by the shopping quantity
      );
    }

    res.json({ message: 'Item checked off and pantry updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/shopping/:id  — remove from shopping list
const deleteShoppingItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Shopping item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getShoppingList, addShoppingItem, checkOffItem, deleteShoppingItem };
