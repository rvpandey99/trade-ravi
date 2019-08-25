//inport packages
const express = require('express');
const normalizePort = require('normalize-port');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

//middlewares



//create routes
app.get('/', (req,res) => {
    res.send('<h3>Hello World</h3>').status(200);
})

//connect to mongodb
mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true }, (err)=>{
    if(!err) {
        console.log('Connected to DB');
    }
    else {
        console.log(err);
    }
})

//resolve the port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//start the server
app.listen(port, (err) => {
    if (err !== undefined) {
        console.log(err);
    }
    else {
        console.log(`server is listening on port ${port}`);
    }
});


