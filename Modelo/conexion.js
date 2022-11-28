const c = require('sqlite3').verbose();
const path = require('path')
const DB = new c.Database(path.join(__dirname,"data.db"),error=>{
    if(error){
        console.log(error);
    }else{
        console.log("Conectado con exito ....")
        console.log(__dirname,"data.db");
    }
})

module.exports = DB;