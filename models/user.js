const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    userId: {type:String, lowercase:true, required:true, minlength:3, maxlength:30, unique:true},
    userName: {type:String, required:true, minlength:3, maxlength:30},
    email: {type:String,  lowercase:true, required:true, unique:true},
    password: {type:String, required:true},
    registrationDate: { type: Date, default: Date.now }  
});

module.exports = mongoose.model('User', userSchema);