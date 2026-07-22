const express = require('express');
const { getCart, syncCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, syncCart);

module.exports = router;
