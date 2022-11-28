const { enviarMail } = require("../../Utilidades/Sender");
const DB = require("../conexion");

class UsuarioGenerico{
    constructor(tabla){
        this.tabla = tabla;
    }
    autenticar(usuario, clave,cb){
        let sql = 'SELECT rowid,* from '+this.tabla+' where correo ="'+usuario+'" and clave="'+clave+'"';
        DB.all(sql,(error,rows)=>{
            if(error){
                cb({ok:false,resultado:error})
            }else{
                if(rows.length>0){
                    cb({ok:true,resultado:rows[0].rowid})
                }else{
                    cb({ok:true,resultado:false})
                }
                
            }
        })
    }
    ingresar(usuario, clave,cb){
        let sql ='INSERT INTO '+this.tabla+' VALUES ("'+usuario+'","'+clave+'")'
        DB.run(sql,(error)=>{
            if(error){
                cb({ok:false,resultado:error})
            }else{
                let html=""
                enviarMail(usuario,"Credenciales","Su usuario es "+usuario+" y su clave, "+clave,html)
                cb({ok:true,resultado:true})
            }
        })
        //TODO enviar mail...
    }

}

//let u = new UsuarioGenerico("Supervisor")
//u.autenticar("ADMIN","123",console.log)
module.exports = UsuarioGenerico