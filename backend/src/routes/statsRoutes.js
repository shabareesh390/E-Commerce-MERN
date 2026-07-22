const express = require('express');
const { getStats } = require('../controllers/statsController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, requireAdmin, getStats);

module.exports = router;
