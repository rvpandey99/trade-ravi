const express = require('express');
const router = express.Router();
const verify = require('./verify');

router.get('/', verify, (req,res) => {
    res.send('This route is protected. But you are special.').status(200);
})

module.exports = router;