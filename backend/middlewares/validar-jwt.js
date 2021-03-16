const jwt = require('jsonwebtoken')



const validarJWT = (req, res, next)=>{

    const token = req.header('x-token')
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {

       const {email, username,state, user_type} = jwt.verify(token, process.env.JWT_SECRET)
       req.username = username;
       req.email = email;
       req.state = state;
       req.user_type = user_type;
       
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token no valido'
        })
    }

    next()

}


module.exports = {
    validarJWT
}