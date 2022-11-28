const UsuarioGenerico = require("./UsuarioGenerico");
const DB = require("../conexion");
class Administrador extends UsuarioGenerico{
    constructor(){
        super("Administrador");
    }
    todos(usuario,clave,tabla,cb){
        this.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`SELECT rowid,* FROM ${tabla}  `
                    console.log(sql)
                    DB.all(sql,(er,row)=>{
                        if(er){
                            cb({ok:false,resultado:false})
                        }else{
                            cb({ok:true,resultado:row})
                        }
                    })
                    
                }else{
                    cb({ok:true,resultado:false})
                }
            }else{
                console.log(r.resultado);
            }
        })
    }
}

module.exports = Administrador
