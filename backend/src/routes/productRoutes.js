const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

module.exports = router;
