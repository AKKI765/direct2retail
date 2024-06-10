const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userDetails: Array,
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        },
    ],
},{timestamps:true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
