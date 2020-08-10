const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs'); // para encriptar
const {generarJWT} = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find();

    res.status(200).json({
        ok: true,
        usuarios
    });
}

const crearUsuario = async (req, res) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                message: 'El correo ya existe'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(); // Generamos una data de manera aleatoria
        usuario.password = bcrypt.hashSync(password, salt); // Aqui le pasamos el valor y el salt para hashiar

        // Guardar el usuario
        await usuario.save();

        const token = await generarJWT(usuario._id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}

const actualizarUsuario = async (req, res) => {
    // Validar token "pendiente"

    const uid = req.params.id;
    console.log(uid);

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizacion
        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email});
            if (existeEmail) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese Email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Usuaria actualizado exitosamente',
            usuarioActualizado
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}


const borrarUsuario = async(req, res) =>{
    const uid= req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        res.status(200).json({
            ok: true,
            msg: 'Usuaria Eliminado exitosamente',
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            error
        });
    }
}




module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}