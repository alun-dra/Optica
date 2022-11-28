const express = require('express')
const Vendedor = require('./Modelo/DAO/Vendedor')
const Stock = require('./Modelo/DAO/Stock')
const Bodega = require('./Modelo/DAO/Bodega')
const Administrador = require('./Modelo/DAO/Administrador')
const Super = require('./Modelo/DAO/Super')
const app = express()
const port = 3000
const DB = require("./Modelo/conexion");

app.set('view engine','ejs')
app.use(express.json())

/////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/autenticar', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let tipo = req.query.tipo
  console.log(usuario,clave,tipo)
  if(tipo == '1'){
    let V = new Vendedor();
    V.autenticar(usuario,clave,(r)=>{
      if(r.ok && r.resultado  ){
        console.log(r)
        res.render('pages/vendedor',{email:usuario,id:r.resultado,password:clave})
      }
    })
  }
  if(tipo == '2'){
    let B = new Bodega();
    B.autenticar(usuario,clave,(r)=>{
      if(r.ok && r.resultado  ){
        console.log(r)
        let S = new Stock();
        S.verTodasRecetas(usuario,clave,(R)=>{
          console.log(R)
          res.render('pages/bodega',{email:usuario,id:r.resultado,password:clave,lista:R.resultado})
        })
        
      
        
      }
    })    
  }
  if(tipo == '3'){
    let A = new Administrador();
    A.autenticar(usuario,clave,(r)=>{
      if(r.ok && r.resultado  ){
        console.log(r)
        res.render('pages/administrador',{email:usuario,id:r.resultado,password:clave})
      }
    })
  }
  if(tipo=='4'){//ingresarNuevoUsuario
    let A = new Super()
    A.autenticar(usuario,clave,(r)=>{
      if(r.ok && r.resultado  ){
        console.log(r)
        res.render('pages/super',{email:usuario,id:r.resultado,password:clave})
      }
    })
  }
})

app.get('/ingresarNuevoUsuario', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let nuevoemail = req.query.nuevoemail
  let nuevopassword = req.query.nuevopassword
  let tipo = req.query.tipo
  //console.log(usuario,clave,id,cliente,venta,cantidad,producto)
  let X;
  if(tipo=='1'){
    X= new Vendedor()
  }
  if(tipo=='2'){
    X= new Bodega()
  }
  if(tipo=='3'){
    X= new Administrador()
  }
  if(tipo=='4'){
    X= new Super()
  }
  X.ingresar(nuevoemail,nuevopassword,(r)=>{
    if(r.ok){
      res.render('pages/super',{email:usuario,id:r.resultado,password:clave})
    }else{
      res.render('pages/super',{email:usuario,id:r.resultado,password:clave})
    }
  })
  
})

app.get('/ingresarOrdenDeCompraSuper', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let producto = req.query.id_producto/1
  let cantidad = req.query.cantidad_producto/1
  //console.log(usuario,clave,id,cliente,venta,cantidad,producto)
  let S = new Stock();
  S.generarOrdenDecompraSuper(usuario,clave,producto,cantidad,(r)=>{
    console.log(r)
    if(r.ok){
      res.render('pages/super',{email:usuario,id:id,password:clave})
    }else{
      res.render('pages/super',{email:usuario,id:id,password:clave})
    }
  })
  
})
app.get('/ingresarOrdenDeCompra', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let producto = req.query.id_producto/1
  let cantidad = req.query.cantidad_producto/1
  //console.log(usuario,clave,id,cliente,venta,cantidad,producto)
  let S = new Stock();
  S.generarOrdenDecompra(usuario,clave,producto,cantidad,(r)=>{
    console.log(r)
    if(r.ok&&r.resultado){
      res.render('pages/administrador',{email:usuario,id:id,password:clave})
    }
  })
  
})

app.get('/atender', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let tipo = req.query.tipo
  let id = req.query.id
  let id_evento = req.query.id_evento;
  console.log(usuario,clave,id)
  let S = new Stock();
  if(tipo=='1'){
    S.atenderOrden(usuario,clave,id_evento,(r)=>{
      console.log("atender Orden 000000000000000000000000000000000000000000000000000000000000000000: ",usuario,clave,id)
        S.verTodasRecetas(usuario,clave,(R)=>{
          console.log(R)
          res.render('pages/bodega',{email:usuario,id:r.resultado,password:clave,lista:R.resultado})
        })
    })
  }else{
    S.atenderReceta(usuario,clave,id_evento,(r)=>{
      console.log("atender Orden 99999999999999999999999999999999999999999999999999999999999: ",usuario,clave,id)
        S.verTodasRecetas(usuario,clave,(R)=>{
          console.log(R)
          res.render('pages/bodega',{email:usuario,id:r.resultado,password:clave,lista:R.resultado})
        })
    })
  }
      
})

app.get('/formularioVentas', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let cliente = req.query.cliente
  console.log(usuario,clave,id,cliente)
  let S = new Stock();
  S.crearReceta(usuario,clave,cliente,(r)=>{
    if(r.ok && r.resultado  ){
      console.log(r)
      S.detalleReseta(usuario,clave,r.resultado,(r1)=>{
          res.render('pages/vendedor_venta',{email:usuario,id:id,venta:r.resultado,password:clave,cliente:cliente,detalle:r1.resultado})
      })
      
    }
  })    
})



app.get('/ingresarProductoVenta', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let cliente = req.query.cliente
  let venta = req.query.venta/1
  let producto = req.query.id_producto/1
  let cantidad = req.query.cantidad_producto/1
  console.log(usuario,clave,id,cliente,venta,cantidad,producto)
  let S = new Stock();
  S.productoReceta(usuario,clave,producto,venta,cantidad,(r)=>{
    console.log(r)
    if(r.ok&&r.resultado){
      S.detalleReseta(usuario,clave,venta,(r1)=>{
        console.log(r1)
        res.render('pages/vendedor_venta',{email:usuario,id:id,venta:venta,password:clave,cliente:cliente,detalle:r1.resultado})
      })
    }
  })
  
})

app.get('/generarBoleta', (req, res) => {
  let usuario = req.query.email
  let clave = req.query.password
  let id = req.query.id/1
  let venta = req.query.venta/1
  
  //console.log(usuario,clave,id,cliente,venta,cantidad,producto)
  let S = new Stock();
  S.generarBoleta(usuario,clave,venta,(r)=>{
    console.log(r)
    if(r.ok && r.resultado  ){
      console.log(r)
      res.render('pages/vendedor',{email:usuario,id:id,password:clave})
    }
  })
  
})
/////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

