const express = require('express');
const { createPaymentIntent, createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/').post(protect, createOrder);

module.exports = router;
