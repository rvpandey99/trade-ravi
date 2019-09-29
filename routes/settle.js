const Trade = require('../models/trade');
const Buy = require('../models/buy');
const Sell = require('../models/sell');
const Stock = require('../models/stocks');

async function settleTrade() {
    const buyMap = {};
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
        if (order.qty > 0 || order.status !== "Fulfilled") buyMap[order.ticker].push(order);
    });
    sellOrders.forEach((order)=>{
        if (order.qty > 0 || order.status !== "Fulfilled") sellMap[order.ticker].push(order);
    });
    console.log(buyMap);
    for(let i in sellMap){
        // console.log(lol,sellMap[lol]);
        sellMap[i].forEach((sale)=>{
            let min1 = sale.aprice - ((sale.aprice * sale.limit)/100);
            let max1 = sale.aprice + ((sale.aprice * sale.limit)/100);
            buyMap[sale.ticker].forEach(async (buying)=>{
                let min2 = buying.bprice - ((buying.bprice * buying.limit)/100);
                let max2 = buying.bprice + ((buying.bprice * buying.limit)/100);
                if (min1>=min2 && min1<=max2) {
                    console.log(min1);
                    const remainBuyQty = await dbStuff(sale,buying,min1);
                    if (remainBuyQty == 0){
                        buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1);
                    }else{
                        let lol ={ orderType: buying.orderType,
                            status: buying.status,
                            _id: buying._id,
                            userId: buying.userId,
                            ticker: buying.ticker,
                            bprice: buying.bprice,
                            qty: remainBuyQty,
                            limit: buying.limit,
                            orderId: buying.orderId,
                            orderDate: buying.orderDate,
                            __v: buying.__v };
                            buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1,lol);
                    }
                    console.log(buyMap[sale.ticker])
                }
                else if (min2>=min1 && min2<=max1) {
                    console.log(min2);
                    const remainBuyQty = await dbStuff(sale,buying,min2);
                    if (remainBuyQty == 0){
                        buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1);
                    }else{
                        let lol ={ orderType: buying.orderType,
                            status: buying.status,
                            _id: buying._id,
                            userId: buying.userId,
                            ticker: buying.ticker,
                            bprice: buying.bprice,
                            qty: remainBuyQty,
                            limit: buying.limit,
                            orderId: buying.orderId,
                            orderDate: buying.orderDate,
                            __v: buying.__v };
                            buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1,lol);
                    }
                    console.log(buyMap[sale.ticker]);
                }
                else if (max1>=min2 && max1<=max2) {
                    console.log(max1);
                    const remainBuyQty = await dbStuff(sale,buying,max1);
                    if (remainBuyQty == 0){
                        buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1);
                    }else{
                        let lol ={ orderType: buying.orderType,
                            status: buying.status,
                            _id: buying._id,
                            userId: buying.userId,
                            ticker: buying.ticker,
                            bprice: buying.bprice,
                            qty: remainBuyQty,
                            limit: buying.limit,
                            orderId: buying.orderId,
                            orderDate: buying.orderDate,
                            __v: buying.__v };
                            buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1,lol);
                    }
                    console.log(buyMap[sale.ticker]);
                }
                else if (max2>=min1 && max2<=max1) {
                    console.log(max2);
                    const remainBuyQty = await dbStuff(sale,buying,max2);
                    if (remainBuyQty == 0){
                        buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1);
                    }else{
                        let lol ={ orderType: buying.orderType,
                        status: buying.status,
                        _id: buying._id,
                        userId: buying.userId,
                        ticker: buying.ticker,
                        bprice: buying.bprice,
                        qty: remainBuyQty,
                        limit: buying.limit,
                        orderId: buying.orderId,
                        orderDate: buying.orderDate,
                        __v: buying.__v };
                        buyMap[sale.ticker].splice(buyMap[sale.ticker].indexOf(buying),1,lol);
                    }
                    
                    console.log(buyMap[sale.ticker]);
                }
            });
        });
    }
}

async function dbStuff(sale,buying,deal) {
    var remainSale = 0;
    var remainBuying = 0;
    var tradeqty = 0;
    if (sale.qty >= buying.qty) {
        remainSale = sale.qty - buying.qty;
        remainBuying = 0;
        tradeqty = buying.qty;
        var buyStatus = "Fulfilled";
        var sellStatus = "Partially fulfilled";
    } else {
        remainSale = 0;
        remainBuying = buying.qty - sale.qty;
        tradeqty = sale.qty;
        var buyStatus = "Partially fulfilled";
        var sellStatus = "Fulfilled";
    }
    await Buy.update({orderId:buying.orderId},{$set:{qty:remainBuying,status:buyStatus}});
    await Sell.update({orderId:sale.orderId},{$set:{qty:remainSale,status:sellStatus}});
    await Stock.update({ticker:buying.ticker},{$set:{marketPrice:deal}});
    const tradeBuy = new Trade({
        orderId: buying.orderId,
        ticker: buying.ticker,
        price: deal,
        qty: tradeqty,
        limit: buying.limit,
        orderDate: buying.orderDate,
        orderType: buying.orderType,
        userId: buying.userId,
        status: buyStatus
    });
    await tradeBuy.save();
    const tradeSell = new Trade({
        orderId: sale.orderId,
        ticker: sale.ticker,
        price: deal,
        qty: tradeqty,
        limit: sale.limit,
        orderDate: sale.orderDate,
        orderType: sale.orderType,
        userId: sale.userId,
        status: sellStatus
    });
    await tradeSell.save();
    return remainBuying;
}

module.exports = settleTrade;