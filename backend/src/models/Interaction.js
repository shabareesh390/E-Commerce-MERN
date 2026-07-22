const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['view', 'cart', 'purchase'],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Interaction = mongoose.model('Interaction', interactionSchema);
module.exports = Interaction;
