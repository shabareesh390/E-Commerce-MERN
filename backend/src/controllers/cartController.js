const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync user cart (add/update/remove items)
// @route   POST /api/cart
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = items;
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        items
      });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  syncCart
};
