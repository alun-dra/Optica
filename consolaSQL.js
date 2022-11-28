const readline = require('readline');
const DB = require('./Modelo/conexion');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('COMANDO SQL de insersion de productos: ', function (sql) {
    DB.run(sql,(e)=>{
        if(e){
            console.log(e)
        }else{
            console.log("OK")
        }
        
    })
    rl.close();
  });
  
  rl.on('close', function () {
    console.log('\nBYEBYE !!!');
    process.exit(0);
  });