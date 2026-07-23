const express = require('express');
const { createProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

module.exports = router;
