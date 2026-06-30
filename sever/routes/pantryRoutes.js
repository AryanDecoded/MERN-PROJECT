const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  updateQuantity,
  deleteItem,
  getSummary,
} = require('../controllers/pantryController');
const { protect } = require('../middleware/authMiddleware');

// All pantry routes are protected — user must be logged in
router.use(protect);

router.get('/summary', getSummary);       // GET  /api/pantry/summary
router.get('/',        getAllItems);       // GET  /api/pantry
router.get('/:id',     getItemById);      // GET  /api/pantry/:id
router.post('/',       addItem);          // POST /api/pantry
router.put('/:id',     updateItem);       // PUT  /api/pantry/:id
router.patch('/:id/quantity', updateQuantity); // PATCH /api/pantry/:id/quantity
router.delete('/:id',  deleteItem);       // DELETE /api/pantry/:id

module.exports = router;
