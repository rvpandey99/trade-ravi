const mongoose = require('mongoose');
const buySchema = mongoose.Schema({
    orderId: {
        type: Number,
        default: Date.now,
        unique: true
    },
    ticker: {
        type: String,
        required: true,
        uppercase: true
    },
    bprice: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    remainingQty: {
        type: Number,
        default: -1
    },
    limit: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderType: {
        type: String,
        default: "Buy"
    },
    userId: {
        type:String,
        lowercase:true,
        required:true
    },
    status: {
        type: String,
        default: "Submitted"
    }
});

module.exports = mongoose.model('Buy', buySchema)