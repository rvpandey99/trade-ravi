const Trade = require('../models/trade');
const Buy = require('../models/buy');
const Sell = require('../models/sell');
const Stock = require('../models/stocks');

async function settleTrade() {
    let buyMap = {};
    const sellMap = {};
    const stocks = await Stock.find({}, (error, stock)=>{
        if(error){
            return console.log(error);
        }
        return stock;
    });
    stocks.forEach((stock)=>{
        buyMap[stock.ticker] = [];
    });
    stocks.forEach((stock)=>{
        sellMap[stock.ticker] = [];
    });
    //console.log(buyMap);
    const buyOrders = await Buy.find({}, (error, orders)=>{
        if(error){
            return console.log(error);
        }
        return orders;
    });
    const sellOrders = await Sell.find({}, (error, orders)=>{
        if(error){
            return console.log(error);
        }
        return orders;
    });
    sellOrders.sort((a,b)=>{
        return a.aprice - b.aprice;
    });
    buyOrders.sort((a,b)=>{
        return a.bprice - b.bprice;
    });
    buyOrders.forEach((order)=>{
        buyMap[order.ticker].push(order);
    });
    sellOrders.forEach((order)=>{
        sellMap[order.ticker].push(order);
    });
    // console.log(sellMap);
    for(let lol in sellMap){
        // console.log(lol,sellMap[lol]);
        sellMap[lol].forEach((sale)=>{
            buyMap[sale.ticker].forEach((buying)=>{
                if (sale.aprice == buying.bprice) console.log(sale, buying);
            });
        });
    }
}

module.exports = settleTrade;