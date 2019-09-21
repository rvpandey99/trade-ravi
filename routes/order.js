const express = require('express');
const router = express.Router();
const verify = require('./verify');
const Stock = require('../models/stocks');
const Buy = require('../models/buy');
const Sell = require('../models/sell');
const Joi = require('@hapi/joi');

const buyJoi = Joi.object().keys({
    ticker: Joi.string().required(),
    bprice: Joi.number().required(),
    qty: Joi.number().required(),
    limit: Joi.number().required()
});

router.post('/buy', verify, async (req,res) => {
    const data = req.body;
    const user = req.user;
    // console.log(user);

    let {error, value} = Joi.validate(data, buyJoi);
    if (error) return res.status(400).send(error.details[0].message);
    
    const tickerExist = await Stock.findOne({ticker : value.ticker.toUpperCase()});
    if (!tickerExist) return res.status(400).send('Stock ticker does not exist. Please try again with existing Stock.');
    
    try{
        const sameOrder = await Buy.find({userId: user.userId, ticker: value.ticker},(error,order) => {
            return {error,order};
        }).sort({orderId:-1}).limit(1);
        if (sameOrder.length > 0) {
            if ((Date.now() - sameOrder[0].orderId) < 86400000) {
                return res.status(400).send(`You have an existing order for today with Order ID: ${sameOrder[0].orderId}.You can not order twice for same stock in a day. Please try again tomorrow.`);
            }
            // console.log(sameOrder[0],(Date.now() - sameOrder[0].orderId));
        }
    }catch(error){
        console.log(error);
    }
    const buy = new Buy({
        userId: user.userId,
        ticker: value.ticker,
        bprice: value.bprice,
        qty: value.qty,
        limit: value.limit
    });
    try{
        const buyed = await buy.save();
        return res.status(200).send(buyed);
    }
    catch(error) {
        return res.send(error).status(400);
    }
});

// router.get('/stocks', verify,async (req,res) => {
//     Stock.find({}, (error, stocks)=>{
//         if(error){
//             return res.send(error).status(400);
//         }
//         let stocksMap = {};
//         stocks.forEach((stock)=>{
//             stocksMap[stock.ticker] = stock;
//         });
//         return res.send(stocksMap).status(200);
//     });
// });

module.exports = router;