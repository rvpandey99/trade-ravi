//inport packages
const express = require('express');
const normalizePort = require('normalize-port');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

//global middlewares
app.use(bodyParser.json());

//import models

//import routes
const register = require('./routes/auth');
const protected = require('./routes/protected')

//use route specific middlewares
app.use('/',register);
app.use('/', protected);


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
var port = normalizePort(process.env.PORT || '3003');
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
