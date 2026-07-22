const express = require('express');
const { recordInteraction } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, recordInteraction);

module.exports = router;
