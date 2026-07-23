const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts
} = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRoutes);

router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

router.route('/:id/similar')
  .get(getSimilarProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

module.exports = router;
