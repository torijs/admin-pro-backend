const jwt = require('jsonwebtoken');

// modelos
const Usuario = require('../models/usuario');


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


// Esta funcion es para validar que el usuario sea un administrador o un usuario normal y con base a eso darle ciertos permisos o accesos

const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid; /* Aqui hacemo llamdo al id, ya que ya esta asignado cuando pasa por el primer middleware, y comp este
    es el segundo middleware pues ya se tiene acceso al dato.*/
    
    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe'
            });
        }
        if(usuarioDB.role !== 'ADMIN_ROLE'){
            console.log('No tiene permisos de administrador');
            return res.status(403).json({
                ok:false,
                msg: 'El usuario no tiene permisos de administrador'
            });
        }

        console.log('Si tiene permisos de administrador');
        next(); // Si pasa las dos condiciones anteriores pues simplemente se sigue por que significa que si tiene acceso admnistrador

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

}

// Este es middleware lo utilizaremos para poder modificar datso del usuario de su perfil.

const validarADMIN_ROLE_o_MismoUsuario = async(req, res, next) => {

    const uid = req.uid; /* Aqui hacemo llamdo al id, ya que ya esta asignado cuando pasa por el primer middleware, y comp este
    es el segundo middleware pues ya se tiene acceso al dato.*/

    const id = req.params.id; // Aqui extraemos el id del usuario a la cual vamos a modificar
    
    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe'
            });
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){ // El usuario solo puede modificar su propio perfil y si quiere modificar 
            console.log('El usuario es administrador o es su propio perfil'); // el perfil de otros tiene que ser administrador
            next();
        }else{
            console.log('El usuario no tiene permiso');
            return res.status(403).json({
                ok:false,
                msg: 'El usuario no tiene permisos de administrador'
            });
        }

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

}




module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}