const mongoose = require('mongoose');
const tradeSchema = mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    ticker: {
        type: String,
        required: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: true
    },
    tradedPrice: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    tradedQty: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    settleDate: {
        type: Date,
        default: Date.now,
        unique: true
    },
    orderType: {
        type: String,
        required: true
    },
    userId: {
        type:String,
        lowercase:true,
        required:true
    }
});

module.exports = mongoose.model('trade', tradeSchema)