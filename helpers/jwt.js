const jwt = require('jsonwebtoken'); // Paquete para generar un token


const generarJWT =  (uid) => {

    return new Promise((resolve, reject) => {
        const payload= {
            uid: uid
        };
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn:'24h'
        }, (err, token) =>{
            if(err){
                console.log(err);
                reject('No se pudo general el token');
            }else{
                resolve(token);
            }
    
        });
    });

}


module.exports ={
    generarJWT
}