const express = require('express');
const router = express.Router();
const { getRecipes } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRecipes); // GET /api/recipes

module.exports = router;
