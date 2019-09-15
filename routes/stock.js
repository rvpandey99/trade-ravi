const express = require('express');
const router = express.Router();
const verify = require('./verify');
const Stock = require('../models/stocks');
const Joi = require('@hapi/joi');

const stockJoi = Joi.object().keys({
    ticker: Joi.string().required(),
    company: Joi.string().required(),
    marketPrice: Joi.number().required()
});

router.post('/stocks', verify,async (req,res) => {
    const data = req.body;
    let {error, value} = Joi.validate(data, stockJoi);
    if (error) return res.status(400).send(error.details[0].message);
    
    const tickerExist = await Stock.findOne({ticker : value.ticker.toUpperCase()});
    if (tickerExist) return res.status(400).send('Stock ticker already exist. Please try again with different Stock.')
    
    // const companyExist = await Stock.findOne({company : value.company.toUpperCase()});
    // if (companyExist) return res.status(400).send('Company already used')

    const share = new Stock({
        ticker: value.ticker,
        company: value.company,
        marketPrice: value.marketPrice
    });

    try{
        const savedShare = await share.save();
        res.send(savedShare).status(200);
    }
    catch(err) {
        res.send(err).status(500);
    }
});

router.get('/stocks', verify,async (req,res) => {
    Stock.find({}, (error, stocks)=>{
        if(error){
            return res.send(error).status(400);
        }
        let stocksMap = {};
        stocks.forEach((stock)=>{
            stocksMap[stock.ticker] = stock;
        });
        return res.send(stocksMap).status(200);
    });
});

module.exports = router;