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

    const tickerExist = await Stock.findOne({ticker : value.ticker.toUpperCase()});
    if (!tickerExist) return res.status(400).send('Stock ticker does not exist. Please try again with existing Stock.');

    const buy = new Buy({
        userId: user.userId,
        ticker: value.ticker,
        bprice: value.bprice,
        qty: value.qty,
        limit: value.limit
    });
    try{
        const bought = await buy.save();
        return res.status(200).send(bought);
    }
    catch(error) {
        return res.send(error).status(400);
    }
});

// Sell logic
const sellJoi = Joi.object().keys({
    ticker: Joi.string().required(),
    aprice: Joi.number().required(),
    qty: Joi.number().required(),
    limit: Joi.number().required()
});

router.post('/sell', verify, async (req,res) => {
    const data = req.body;
    const user = req.user;
    // console.log(user);

    let {error, value} = Joi.validate(data, sellJoi);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const sameOrder = await Sell.find({userId: user.userId, ticker: value.ticker},(error,order) => {
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

    const tickerExist = await Stock.findOne({ticker : value.ticker.toUpperCase()});
    if (!tickerExist) return res.status(400).send('Stock ticker does not exist. Please try again with existing Stock.');

    const sell = new Sell({
        userId: user.userId,
        ticker: value.ticker,
        aprice: value.aprice,
        qty: value.qty,
        limit: value.limit
    });
    try{
        const sold = await sell.save();
        return res.status(200).send(sold);
    }
    catch(error) {
        return res.send(error).status(400);
    }
});

router.get('/orders', verify, async (req,res) => {
    const user = req.user;
    const ordersMap = {};
    await Buy.find({userId: user.userId}, (error, orders)=>{
        if(error){
            return res.send(error).status(400);
        }
        orders.forEach((order)=>{
            ordersMap[order.orderId] = order;
        });
        await Sell.find({userId: user.userId}, (error, orders)=>{
            if(error){
                return res.send(error).status(400);
            }
            orders.forEach((order)=>{
                ordersMap[order.orderId] = order;
            });
        });
    });
    // await Sell.find({userId: user.userId}, (error, orders)=>{
    //     if(error){
    //         return res.send(error).status(400);
    //     }
    //     orders.forEach((order)=>{
    //         ordersMap[order.orderId] = order;
    //     });
    // });
    return res.send(ordersMap).status(200);
});

module.exports = router;