const mongoose = require('mongoose');
const stockSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        uppercase: true, 
        unique:true
    },
    company: {
        type: String,
        required: true, 
        unique:true
    },
    marketPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Stock', stockSchema)