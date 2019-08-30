const mongoose = require('mongoose');
const user = mongoose.Schema({
    firstName: String,
    lastName: String  
});

const User = mongoose.model('User', user);
module.exports = User;