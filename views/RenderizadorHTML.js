const fs = require('fs');
////////////////////////////FUNCIONES/////////////////////
function renderizador( txt, nombre,caracter){
    ///var txt = fs.readFileSync(archivo,"utf-8");
    var textoEditado = txt.replace( caracter ,nombre)
    while(textoEditado.indexOf(caracter) != -1){
        textoEditado = textoEditado.replace( caracter ,nombre)
    }
    return textoEditado
}

function renderizador2( archivo, matriz){
    var txt = fs.readFileSync(archivo,"utf-8");
    var textoFinal = txt;
    if(matriz!=undefined){
        for(var i = 0 ; i<=matriz.length-1 ; i++){
            textoFinal = renderizador(textoFinal,matriz[i][0],matriz[i][1])
        }
    }

    return textoFinal;
}

module.exports={RENDER:renderizador,RENDERIZAR:renderizador2}