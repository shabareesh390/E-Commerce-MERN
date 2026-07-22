const Interaction = require('../models/Interaction');

// @desc    Record a user interaction
// @route   POST /api/interactions
// @access  Private
const recordInteraction = async (req, res) => {
  try {
    const { productId, type } = req.body;
    
    // Optional: we could check if an interaction of this type already exists recently
    // to prevent spamming the db, but for now we'll just save it.
    
    const interaction = new Interaction({
      user: req.user._id,
      product: productId,
      type
    });
    
    await interaction.save();
    res.status(201).json({ message: 'Interaction recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordInteraction };
