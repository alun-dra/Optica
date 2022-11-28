const c = require('sqlite3').verbose();
const path = require('path')
const DB = new c.Database(path.join(__dirname,"data.db"),error=>{

    if(error){
        console.log(error);
    }else{
        console.log("Conectado....")
    }
})

const inicio = `
    CREATE TABLE Vendedor(
    correo VARCHAR(100),
    clave VARCHAR(100)
    );
    
    CREATE TABLE Bodega(
    correo VARCHAR(100),
    clave VARCHAR(100)
    );
    
    CREATE TABLE Administrador(
    correo VARCHAR(100),
    clave VARCHAR(100)
    );
    
    CREATE TABLE Super(
    correo VARCHAR(100),
    clave VARCHAR(100)
    );
    
    
    CREATE TABLE Producto(
    nombre VARCHAR(100),
    descripcion VARCHAR(1000),
    imagen VARCHAR(100),
    cantidad int,
    precio float
    );
    
    
    
    CREATE TABLE Receta(
    id_vendedor int  ,
    nombre varchar(200),
    fecha DATE,
    total float,
    atendida bool,
    id_bodega int
    );
    
    CREATE TABLE Producto_Receta(
    id_receta int ,
    id_producto int,
    cantidad int
    );
    
    CREATE TABLE Boleta(
    id_receta int 
    );
    
        
    CREATE TABLE OrdenDeCompra(
    id_producto int ,
    id_administrador int ,
    cantidad int,
    fecha DATE,
    atendida bool,
    id_bodega int
    );       
    INSERT INTO Administrador VALUES("ADMIN@mail.com","123");
    INSERT INTO Bodega VALUES("B1@mail.com","123");
    INSERT INTO Super VALUES("ADMIN@mail.com","123");
    INSERT INTO Super VALUES("ADMIN2@mail.com","123");
    INSERT INTO Vendedor VALUES("V1@mail.com","123");
    INSERT INTO Vendedor VALUES("V2@mail.com","123");
    INSERT INTO Producto VALUES("Lentes","Solo son lentes ","lentes.png",2000,10);
    INSERT INTO Producto VALUES("Lentes2","Solo son lentes2 ","lentes2.png",2000,10)
`.split(";")
function EXEC(array,limite,i){
    if(i<limite){
        DB.run(array[i],(error)=>{
            if(error){
                console.log(error)
            }else{
                console.log("EJECUTADO...")
                EXEC(array,limite,i+1)
            }
            
        })
    }
}
EXEC(inicio,inicio.length,0)