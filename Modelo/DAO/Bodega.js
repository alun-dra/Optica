const UsuarioGenerico = require("./UsuarioGenerico");
const DB = require("../conexion");

class Bodega extends   UsuarioGenerico{
    constructor(){
        super("Bodega");
    }
    
}
module.exports = Bodega