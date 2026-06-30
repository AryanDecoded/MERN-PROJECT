const express = require('express');
const router = express.Router();
const { getShoppingList, addShoppingItem, checkOffItem, deleteShoppingItem } = require('../controllers/shoppingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',       getShoppingList);    // GET    /api/shopping
router.post('/',      addShoppingItem);    // POST   /api/shopping
router.patch('/:id',  checkOffItem);       // PATCH  /api/shopping/:id  (check off)
router.delete('/:id', deleteShoppingItem); // DELETE /api/shopping/:id

module.exports = router;
