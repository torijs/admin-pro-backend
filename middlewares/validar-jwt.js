const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {


    // Leer token
    const token = req.header('x-token'); // De esta forma vamos a leer el token que viene en el header()

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:'El Token es Obligatorio'
        })
    }
    try{
        const {uid} = jwt.verify(token, process.env.JWT_SECRET); // Aqui hara la comprobacion de que el token sea veridico
        req.uid = uid;
        next();

    }catch(error){
        return res.status(500).json({
            ok: false,
            msg:'El token es invalido'
        })
    }
}




module.exports = {
    validarJWT
}