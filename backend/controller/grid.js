//imports 
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbConfig = require('./db.json');
const { json } = require('body-parser');


 exports.makeConnection = ()=>{
    const db = mysql.createConnection(
       {
           host: dbConfig.host,
           user: dbConfig.user,
           password: dbConfig.password,
           database: dbConfig.database
       }
   );
   
   return db;

}



exports.getSelect = (req, res )=>{
    // userId corresponde al usuario que esta en sesion en ese momento. 
    const {funcion, userId} = req.body;

    const db = this.makeConnection();
    //const data= this.getUsuario(userId)
    // res.json({
    //     funcion,
    //     data
    //})
    const query = `SELECT maegrd.* FROM maegrd 
                    INNER JOIN detgrd USING(funcion,base,tabla,llave,campo) 
                    WHERE usuario="${userId}" AND (maegrd.visible="E" OR detgrd.visible <> "N") AND maegrd.funcion= "${funcion}" 
                    ORDER BY detgrd.orden`;

    
    db.query(query, (error,results)=>{
        
        
        const select = '';
        const filter = '';
        const maestros = {};
        //const maegrd = results;

        for (const grd in results) {
            if (Object.hasOwnProperty.call(results, grd)) {
                
                console.log(results)

                const titulo = results[0].titulo;
                const mascara = results[0].mascara;
                const tipo = results[0].tipo;
                const formula = results[0].formula;
                const width = results[0].ancho * 10;
                const editarCon = results[0].editarcon;
                const lista = results[0].lista

                
                if(width === 0){
                    width = 10
                }

                //definirpermisos de usuario para verPrecio y verCosto

                const llave = (results[0].llave).toLowerCase();
                //const llaveRes = llave.toLowerCase();

                //continuamos con campos
                const id = results[0].id
                const base = (results[0].base).toLowerCase()
                const tabla = (results[0].tabla).toLowerCase()
                const nombre = (results[0].campo).toLowerCase()
                //viene titulo
                const predet = results[0].inicial
                const sortable = 'true'
                //viene editarcon
                const cols = results[0].ancho
                //viene width
                const visible = 'true'
                const fija = 'false'
                //viene editarcon
                //const lista = results[0].lista
                console.log(lista)
                const valores = results[0].valores

                const campos = {
                    id : `id_${id}`,
                    base: base,
                    tabla : tabla,
                    nombre : nombre,
                    titulo : titulo,
                    default : predet,
                    sortable : sortable,
                    editable : editarCon === '' ? false: true,
                    cols : cols,
                    width : width,
                    visible : visible,
                    fija : fija,
                    editarcon : editarCon,
                    lista : this.getObjeto.call(lista, valores),
                    //autofocus : false,
                }
        
                
                const data = {
                    titulo,
                    mascara,
                    tipo,
                    formula,
                    width,
                    editarCon,
                    llave,
                    campos
                    
                }

                console.log(data)
            }
        }
        

    })  
}

exports.getMaeUser = (userId)=>{
    const db = this.makeConnection()
    const query = `select usuario from maeusr where usuario = ${userId}`
    db.query(query, (error, results)=>{
        
        console.log(results[0].usuario)
        return results[0].usuario;
    })

}


exports.getObjeto = function (nombres, valores){
    console.log(nombres)
    const obj = [];
    console.log(valores)
        console.log(nombres, valores)
            if(nombres != ''){
                
                const nom = nombres.split(',');
                const val = valores.split(',');
                
                return nom, val;
            }
}





 