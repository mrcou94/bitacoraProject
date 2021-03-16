//imports 
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { json } = require('body-parser');
const { generarJWT } = require('../helpers/jwt');



exports.makeConnection = ()=>{
    const db = mysql.createConnection(
       {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
       }
   );
   
   return db;

}

exports.login =  (req, res) => {

    const {username, email, password, state, user_type} = req.body;

    try {
        const db = this.makeConnection();

       db.query('select * from user where email=?', [email], async (error, results)=>{
            
                if(!results[0]){
                    res.status(500).json({
                        ok: false,
                        msg: 'Email incorrecto'
                    })
                } 
                
                const validPassword = bcrypt.compareSync(password, results[0].password)
                if(!validPassword){
                    res.status(500).json({
                        ok: false,
                        msg: 'Password incorrecto'
                    })
                }

                //Generar JWT 
                //const dataToken = {username: results[0].username, email: results[0].email, status: results[0].state, user_type: results[0].user_type}
                const username = results[0].username;
                const email = results[0].email;
                const state = results[0].state;
                const user_type = results[0].user_type;
                
            
                const token = await generarJWT(username, email, state, user_type);

                //respuesta del servicio 

                return res.json({
                    ok: true,
                    username: username,
                    email: email,
                    state: state,
                    user_type: user_type,
                    token
                })
        });


      
        
    } catch (error) {
        return res.status(500).json({
            ok: false, 
            msg: 'Hable con el administrador'
        })
    }


}


exports.register = (req, res)=>{
    const {username, email, password, state, user_type} = req.body;

    try {
        //Verificar email
        const db = this.makeConnection();
        db.query('select email from user where email=?', [email], async (error, results)=>{
            
            if(results.length > 0){
                 res.status(400).json({
                    ok: false,
                    msg: 'Usuario ya existe, intente con otro'
                })
            }else{
                //Hashear contrasena
            const salt = bcrypt.genSaltSync(); //vueltas para encriptar contrasena
            const hashedPassword = bcrypt.hashSync(password, salt)

            //Generar JWT 
            //const dataToken = {username, email, state,user_type}
            const token = await generarJWT(username, email, state, user_type)

            const query = `insert into user set ?`;
            const values = {username: username, email: email, password:hashedPassword,state: state,user_type:user_type,}
            db.query(query, values, (error, results)=>{
               return res.json({
                    ok: 'true',
                    msg: 'Registrado con exito',
                    username,
                    email,
                    state,
                    user_type,
                    token
                })
            })
            }

            
            
            
        })

        
        //generar el jwt
        //generar respuesta exitosa 
        
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
       
}


exports.checkToken = async (req, res)=>{
    
    const {username, email, state, user_type} = req;
    const dataToken = {username, email, state,user_type}
    const token = await generarJWT(username, email, state,user_type)

    res.send({
        ok: true,
        msg: 'renew',
        username,
        email,
        state,
        user_type,
        token
    })
}