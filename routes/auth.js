const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Joi schemas
const registerSchema = Joi.object().keys({
    userId: Joi.string().alphanum().min(3).max(30).required(),
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[@#$%&^*()])[A-Za-z\d@#$%&^*()]{8,}$/).required()
});

const loginSchema = Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().regex(/^(?=.*[@#$%&^*()])[A-Za-z\d@#$%&^*()]{8,}$/).required()
});

//route
router.post('/register',async (req,res)=>{
    const data = req.body;
    let {error, value} = Joi.validate(data, registerSchema);
    if (error) return res.status(400).send(error.details[0].message);
    
    const userIdExist = await User.findOne({userId : value.userId.toLowerCase()});
    if (userIdExist) return res.status(400).send('User ID already exist. Please try again with different User Id.')
    
    const emailExist = await User.findOne({email : value.email.toLowerCase()});
    if (emailExist) return res.status(400).send('Email ID already registered. Please try Log in.')

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value.password,salt);
    // register the user if validation passes
    const user = new User({
        userId: value.userId,
        userName: value.userName,
        email: value.email,
        password: hash
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser).status(200);
    }
    catch(err) {
        res.send(err).status(500);
    }
});

router.post('/login', async (req,res)=>{
    const data = req.body;
    let {error, value} = Joi.validate(data, loginSchema);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({userId : value.userId.toLowerCase()}) || await User.findOne({email : value.userId.toLowerCase()});
    if (!user) return res.status(501).send('User details are wrong.');

    const verified = await bcrypt.compare(value.password, user.password);
    if (!verified) return res.status(501).send('Password is incorrect.');

    // assign jwt
    const token = jwt.sign({userId: user.userName}, process.env.SECRET, {expiresIn:'1h'});
    const payload = {
        userId: user.userId,
        userName: user.userName,
        token: token
    }
    res.status(200).header("authToken",token).json(payload);
});

module.exports = router;