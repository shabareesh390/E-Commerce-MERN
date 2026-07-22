const express = require('express');
const { createPaymentIntent, createOrder, getMyOrders, getOrderById, getOrders } = require('../controllers/orderController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/').post(protect, createOrder).get(protect, requireAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
