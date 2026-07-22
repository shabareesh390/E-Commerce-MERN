const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// @desc    Create Payment Intent
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    // Calculate total amount on the server securely
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.items.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const totalAmount = subtotal + shipping + tax;
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order after successful payment
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentIntentId
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      }
    });

    const createdOrder = await order.save();

    // Clear the cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  createOrder
};
