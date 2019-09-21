//inport packages
const express = require('express');
const normalizePort = require('normalize-port');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors')
require('dotenv/config');
const app = express();

//global middlewares
app.use(cors());
app.use(bodyParser.json());

//import models

//import routes
const register = require('./routes/auth');
const stock = require('./routes/stock');
const order = require('./routes/order');

//use route specific middlewares
app.use('/',register);
app.use('/', stock);
app.use('/', order);


//connect to mongodb
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true }, (err)=>{
    if(!err) {
        console.log('Connected to DB');
    }
    else {
        console.log(err);
    }
});
//create routes

//resolve the port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//start the server
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`server is listening on port ${port}`);
    }
});
