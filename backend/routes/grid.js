const express = require('express');
const cors = require('cors')
const gridController = require('../controller/grid')

//initialize router
const grid = express.Router();


//middleware 
grid.use(cors())

//requests 

grid.post('/getSelect', gridController.getSelect)


module.exports = grid;