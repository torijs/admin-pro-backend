// modelos
const Usuario = require('../models/usuario');

// Encriptar
const bcrypt = require('bcryptjs');

// helpers
const {generarJWT} = require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');
const {getMenuFrontEnd} = require('../helpers/menu-frontend');


const login =  async(req,res) => {

    const {email, password} = req.body;

    try{
        // Verirficar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario no exitente'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password); // Aqui hacemos una comparacacion de contraeña

        if (!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña no Valido'
            });
        }

        // Generar un Token JWT
        const token = await generarJWT(usuarioDB._id);

        res.status(200).json({
            ok:true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role) // Aqui mandamos el role para que haga la verificacion y mande las rutas visibles
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }
}



const googleSignIn = async(req, res) => {

    const googleToken = req.body.token;
    let usuario;

    try{

    const {name, email, picture} = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({email});
    if(!usuarioDB){
        // Sino existe un usuario.
        usuario = new Usuario({
            nombre: name,
            email,
            password:'@@@',
            img: picture,
            google: true
        });
    }else{
        // si existe un usuario.
        usuario = usuarioDB;
        usuario.google = true;
    }
    // Guardar modificaciones en base de datos.
    await usuario.save();


    //Generar el token = JWT
    const token = await generarJWT(usuario.id);
        
    res.status(200).json({
        ok:true,
        msg:'Google Sign-In',
        token,
        menu:getMenuFrontEnd(usuario.role)
    });

    }catch(error){   
        
    res.status(200).json({
        ok:false,
        msg:' Token incorrecto'
    });
    }
}


const renewToken = async(req, res) =>{

    const uid = req.uid;

       //Generar el token = JWT
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.status(200).json({
        ok:true,
        msg:'Nuevo token Generado',
        token,
        usuario,
        menu:getMenuFrontEnd(usuario.role)
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}
