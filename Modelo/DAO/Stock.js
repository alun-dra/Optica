const { enviarMail } = require("../../Utilidades/Sender");
const DB = require("../conexion");
const Administrador = require("./Administrador");
const Bodega = require("./Bodega");
const Super = require("./Super");
const Vendedor = require("./Vendedor");
class Stock {
    aumentarTotalReceta(id,total,cb){
        let sql =  `UPDATE  Receta SET total = total + ${total} where  rowid=`+id;
        console.log(sql);
        DB.run(sql,(er)=>{
            if(er ){
                cb({ok:false,resultado:er})                
            }else{
                cb({ok:true,resultado:true})     
            }
        })
    }
    obtenerProducto(id,cb){
        let sql =  `SELECT rowid,* from Producto where  rowid=`+id;
        DB.all(sql,(er,r)=>{
            if(er ){
                cb({ok:false,resultado:er})                
            }else{
                if(r.length>0){
                    cb({ok:true,resultado:r[0]})
                }else{
                    cb({ok:true,resultado:false})
                }                
            }
        })
    }    
    productoReceta(usuario, clave,producto,receta, cantidad,cb){
        let U = new Vendedor();
        U.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`INSERT INTO Producto_Receta VALUES (
                        ${receta},${producto},${cantidad})`
                    DB.run(sql,(er)=>{
                        if(er){
                            cb({ok:false,resultado:er})
                        }else{
                            this.obtenerProducto(producto,(r)=>{
                                if(r.ok){
                                    let total = r.resultado.precio * cantidad;
                                    
                                    this.aumentarTotalReceta(receta,total,cb)
                                }else{
                                    console.log(r.resultado)
                                }
                            })                      
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
    crearReceta(usuario, clave,cliente,cb){
        let U = new Vendedor();
        U.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                    
                    let sql=`INSERT INTO Receta VALUES (
                        ${r.resultado},"${cliente}",date('now'),0,false,0)`
                    DB.run(sql,function(er){
                        if(er){
                            cb({ok:false,resultado:er})
                        }else{
                            let id= this.lastID
                            let sql2 = `INSERT INTO Boleta VALUES(${this.lastID})`
                            DB.run(sql2,()=>{
                                cb({ok:true,resultado:id})
                            })                            
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
    atenderReceta(usuario, clave,receta,cb){
        console.log("ATENDER RECETA")
        let B = new Bodega();
        B.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){   
                           
                    DB.all("SELECT PR.cantidad as C , * FROM Receta R, Producto_Receta PR , Producto P  WHERE R.rowid=PR.id_receta and P.rowid=PR.id_producto and PR.id_receta="+receta,(e,r)=>{
                        if(e){
                            cb({ok:false,resultado:e})
                        }else{
                           for (const i of r) {
                                DB.run("UPDATE Producto SET cantidad=cantidad-"+i.C+" WHERE rowid="+i.id_producto,(e)=>{
                                    DB.all("SELECT * FROM Producto Where rowid="+i.id_producto,(e,r)=>{
                                        if(r){
                                            if(10>r[0].canidad){
                                                let mensaje = "EL producto "+r[0].nombre+" esta por acabarse , realice orden de compra..."
                                                DB.all("SELECT * FROM Super",(e,r)=>{
                                                    for(const i of r){
                                                        enviarMail(i.correo,"URGENTE",mensaje);
                                                    }
                                                })
                                                DB.all("SELECT * FROM Administrador",(e,r)=>{
                                                    for(const i of r){
                                                        enviarMail(i.correo,"URGENTE",mensaje);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                })
                           }
                           DB.run("UPDATE Receta SET atendida=true  WHERE rowid="+receta)
                           cb({ok:true,resultado:true})
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
    detalleReseta(usuario, clave,receta,cb){
        let U = new Vendedor();
        U.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`SELECT PR.rowid,P.nombre,PR.* from Producto_Receta PR , Producto P where PR.id_receta=${receta} and P.rowid=PR.id_producto`;
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
    generarBoleta(usuario, clave,receta,cb){
        let U = new Vendedor();
        U.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`INSERT INTO Boleta VALUES (${receta})`
                    console.log(sql)
                    DB.run(sql,(er)=>{
                        if(er){
                            cb({ok:false,resultado:false})
                        }else{
                            cb({ok:true,resultado:true})
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
    generarOrdenDecompraSuper(usuario, clave,producto,canidad,cb){
        let A = new Super();
        A.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`INSERT INTO OrdenDeCompra VALUES (${producto},${r.resultado},${canidad},date('now'),false,0)`
                    console.log(sql)
                    DB.run(sql,(er)=>{
                        if(er){
                            cb({ok:false,resultado:false})
                        }else{
                            cb({ok:true,resultado:true})
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
    generarOrdenDecompra(usuario, clave,producto,canidad,cb){
        let A = new Administrador();
        A.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`INSERT INTO OrdenDeCompra VALUES (${producto},${r.resultado},${canidad},date('now'),false,0)`
                    console.log(sql)
                    DB.run(sql,(er)=>{
                        if(er){
                            cb({ok:false,resultado:false})
                        }else{
                            cb({ok:true,resultado:true})
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
    verTodasOrdenDecompra(usuario, clave,cb){
        let B = new Bodega();
        B.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    let sql=`SELECT o.rowid,o.cantidad ,o.fecha,p.nombre, 'Orden de compra' as tabla FROM OrdenDeCompra o , Producto p WHERE p.rowid=o.id_producto and o.atendida=false `
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
    verTodasRecetas(usuario, clave,cb){
        let B = new Bodega();
        B.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){                
                    DB.all(`SELECT PR.*,P.nombre as producto,R.* FROM Producto_Receta PR, Producto P , Receta R WHERE PR.id_receta=R.rowid and PR.id_producto=P.rowid and R.atendida=false`,(er,r)=>{
                        let R = []
                        let RR = []                        
                        for (const i of r) {
                            R[i.id_receta]={tabla:"Ventas",rowid:i.id_receta,fecha:i.fecha,lista:[]}        
                        }
                        for (const i of r) {
                            R[i.id_receta].lista.push({producto:i.producto,cantidad:i.cantidad})
                        }
                        for (const i of R) {
                            if(i!=null){
                                RR.push(i)
                            }
                        }
                        this.verTodasOrdenDecompra(usuario,clave,(r)=>{
                            if(r.ok){
                                for (const i of r.resultado) {
                                    RR.push(i)
                                }
                                cb({ok:true,resultado:RR})
                            }else{
                                cb({ok:false,resultado:false})
                            }
                        })
                        
                    })                    
                }else{
                    cb({ok:true,resultado:false})
                }
            }else{
                console.log(r.resultado);
            }
        })    
    }
    atenderOrden(usuario, clave,id,cb){
        let B = new Bodega();
        B.autenticar(usuario,clave,(r)=>{
            if(r.ok){
                if(r.resultado){   
                    console.log("ID;",id)            
                    DB.all("SELECT * FROM OrdenDeCompra WHERE rowid="+id,(e,r)=>{
                        if(e){
                            cb({ok:false,resultado:e})
                        }else{
                            if(r.length>0){
                                let c = r[0].cantidad
                            let i =  r[0].id_producto
                            let sql =`UPDATE Producto SET cantidad=cantidad +${c}  WHERE rowid=${i}`;

                            DB.run(sql,(e)=>{
                                if(e){
                                    cb({ok:false,resultado:e})
                                }else{
                                    cb({ok:true,resultado:true})
                                }
                            })
                            DB.run("UPDATE OrdenDeCompra SET atendida = true WHERE rowid="+id,console.log);
                            }else{
                                cb({ok:true,resultado:false})
                            }
                            
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


module.exports = Stock