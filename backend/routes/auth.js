const express = require('express');
const cors = require('cors')
const {check} = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const authController = require('../controller/auth');
const { validarJWT } = require('../middlewares/validar-jwt');

//initialize router
const auth = express.Router();


//middleware 
auth.use(cors())

//requests 
auth.post('/login',
        [
        check('email', 'Please insert email').isEmail(),
        check('password','Please insert password').isLength({min:6}),
        validarCampos
        ],
    authController.login); 


auth.post('/register',
        [
        check('email', 'Please insert email').isEmail(),
        check('password','Please insert password').isLength({min:6}),
        validarCampos
        ], 
    authController.register);

auth.get('/checkToken',validarJWT,authController.checkToken);

module.exports = auth;