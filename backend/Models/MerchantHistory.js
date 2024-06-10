const mongoose = require('mongoose');

const MerchantHistorySchema = new mongoose.Schema({
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

const MerchantHistory = mongoose.model('MerchantHistory', MerchantHistorySchema);

module.exports = MerchantHistory;
