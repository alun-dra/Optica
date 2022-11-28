const DB = require("./Modelo/conexion");
const Vendedor = require("./Modelo/DAO/Vendedor");
const Stock = require("./Modelo/DAO/Stock");
const { enviarMail } = require("./Utilidades/Sender");


let x = new Stock();
//x.crearReceta("V1","123",4,console.log)
//x.productoReceta("V1","123",1,1,20,console.log)
//SELECT rowid,* from Producto_Receta where id_receta=
//enviarMail("marcelojimeneztrujillo@gmail.com","asuntoooo","mensaje","HTLM")


DB.all("SELECT * FROM Receta R, Producto_Receta PR , Producto P  WHERE R.rowid=PR.id_receta and P.rowid=PR.id_producto and PR.id_receta="+2,(e,r)=>{
    console.log(r)
})
DB.all("SELECT * from Producto",(e,r)=>{
    console.log(r)
})
/*

DB.all("SELECT * from OrdenDeCompra",(e,r)=>{
    console.log(r)
})
DB.all("SELECT * from Boleta",(e,r)=>{
    console.log(r)
})
DB.all("SELECT * from Administrador",(e,r)=>{
    console.log(r)
})
DB.all("SELECT * from Vendedor",(e,r)=>{
    console.log(r)
})
DB.all("SELECT * from Super",(e,r)=>{
    console.log(r)
})


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
    
})
*/