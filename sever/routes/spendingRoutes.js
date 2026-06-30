const express = require('express');
const router = express.Router();
const { getSpending, exportCSV, inviteMember } = require('../controllers/spendingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',         getSpending);   // GET  /api/spending
router.get('/export',   exportCSV);     // GET  /api/spending/export  → CSV download
router.post('/invite',  inviteMember);  // POST /api/spending/invite  → add member

module.exports = router;
