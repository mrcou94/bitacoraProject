const jwt = require('jsonwebtoken');

const generarJWT = (username, email, state, user_type)=>{

    const payload = {username, email, state, user_type};

    return new Promise((resolve, reject)=>{
        
        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: '24h'
        },(err, token)=>{
            
            if(err){
                
                console.log(err)
                reject(err)
            }else{
                resolve(token)
            }
        })
    })

    
}


module.exports = {
    generarJWT
}