const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

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
            token
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

module.exports = {
    login
}