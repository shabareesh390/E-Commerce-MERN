const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/wishlist/:productId')
  .delete(protect, removeFromWishlist);

router.route('/profile')
  .put(protect, updateUserProfile);

module.exports = router;
