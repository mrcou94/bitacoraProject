//imports
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require("body-parser");


dotenv.config({path: './.env'});
//We initialize express 
const app = express();


//midldlewares 
app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({ extended: false})
);

const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

app.get('/', (req, res)=>{
    res.json({
        message: "Welcome to apiRest"
    })
});


db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log('Database connected succesfully');
    }
});



//routes 
app.use('/auth', require('./routes/auth'));
app.use('/grid', require('./routes/grid'));

//we define a variable with the port
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`Running at: ${port}`)
});