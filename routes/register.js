const express = require('express');
const router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
router.post('/', function (req, res) {
  res.send('hello world');
})