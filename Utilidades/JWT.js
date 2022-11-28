class JWT{
    encriptar(txt,clave){
        const L = txt.length
        const l = clave.length
        let r = ""
        for (let index = 0; index < L; index++) {
            let C = txt.charCodeAt(index)  
            let c = txt.charCodeAt(index%l)
            r=r+""+(c^C)
        }
    }
    validar(digest,txt,clave){
        return digest==(this.encriptar( txt,clave)) 
    }
}
module.exports = new JWT();