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
    aprice: {
        type: 400,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        required: true
    },
    settleDate: {
        type: Date,
        default: Date.now
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderType: {
        type: String,
        required: true
    },
    userId: {
        type:String,
        lowercase:true,
        required:true
    },
    status: {
        type: String,
        required:true
    }
});

module.exports = mongoose.model('trade', tradeSchema)