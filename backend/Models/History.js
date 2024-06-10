const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userDetails: Array,
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

module.exports = History;
