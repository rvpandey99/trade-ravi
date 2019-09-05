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
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
});

const loginSchema = Joi.object().keys({
    userId: Joi.string().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
});

//route
router.post('/register',async (req,res)=>{
    const data = req.body;
    let {error, value} = Joi.validate(data, registerSchema);
    if (error) return res.status(400).send(error.details[0].message);
    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value.password,salt);
    
    const userIdExist = await User.findOne({userId : value.userId});
    if (userIdExist) return res.status(400).send('User ID already exist. Please try again with different User Id.')
    
    const emailExist = await User.findOne({email : value.email});
    if (emailExist) return res.status(400).send('Email ID already registered. Please try Log in.')
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
    
    const user = await User.findOne({userId : value.userId}) || await User.findOne({email : value.userId});
    if (!user) return res.status(400).send('User details are wrong.');

    const verified = await bcrypt.compare(value.password, user.password);
    if (!verified) return res.status(400).send('Password is incorrect.');

    // assign jwt
    const token = jwt.sign({userId: user.userId}, process.env.SECRET)
    res.header("authToken",token).send(token);
});

module.exports = router;