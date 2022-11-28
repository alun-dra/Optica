const UsuarioGenerico = require("./UsuarioGenerico");
const DB = require("../conexion");

class Vendedor  extends UsuarioGenerico{
    constructor(){
        super("Vendedor");
    }
    
}
module.exports = Vendedor