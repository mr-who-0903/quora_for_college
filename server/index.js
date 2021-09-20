const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config({path: './config.env'});

// connecting with cloud db
require('./db/conn');

app.use(express.json());  // to recognise the incoming req obj as JSON obj

//  linking the router files to make our route easy
app.use(require('./router/auth')); // app.use() is a global middleware

const port = process.env.PORT;

app.listen(port, () =>{
    console.log(`listening to port ${port}`)
})