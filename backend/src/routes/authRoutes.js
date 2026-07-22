const express = require('express');
const { registerUser, loginUser, refresh, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refresh);
router.post('/logout', protect, logoutUser);

module.exports = router;
