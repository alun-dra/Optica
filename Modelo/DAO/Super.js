const UsuarioGenerico = require("./UsuarioGenerico");
const DB = require("../conexion");

class Super extends UsuarioGenerico{
    constructor(){
        super("Super");
    }
}

module.exports = Super