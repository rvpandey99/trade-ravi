//inport packages
const express = require('express');
const normalizePort = require('normalize-port');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const app = express();

//middlewares
app.use(bodyParser.json());

//import models
const User = require('./models/user')

//import routes



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
app.get('/', async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    }catch{
        res.json({message:err});
    }
})

app.post('/',(req,res)=>{
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    user.save().then(data => {
        res.send(data).status(200);
    }).catch(err => {
        console.log(err);
    })
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


