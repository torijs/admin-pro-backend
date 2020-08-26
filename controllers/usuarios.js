const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs'); // para encriptar
const {generarJWT} = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0; // La paginación es muy importante ya que si madamos todos los
        // elementos de una base de datos es un desperdicio de recursos.

                                    /*  IMPORTANTE   */
    /*Las siguientes lineas son unas peticiones sincronas ya que estamos utilizando el awaait pero en 
    este caso no es necesario ya que la primera no depende de la otra y en este caso lo que podemos hacer
    es por ejecutar al mismo tiempor las dos mismas peticiones utilizando la promesa que nos proporsiona 
    el emaScript 6. */

    // const usuarios = await Usuario.find()
    //                                 .skip(desde) // De aqui empezara a seleccionar los elementos
    //                                 .limit(5); // hazta donde llegara los elementos selecionados
    // const totalRegistros = await Usuario.count();


    /* En la siguiente promesa lo que estamos haciendo es ejecutar las dos peticiones simultaneamente, ya que ninguna 
    depende de la otra, y asi es mas rapido que un funcion normal en await, ya que eso los ultilizamos cuando una depende 
    del valor de la otra para ejecutarse, los valores de la siguiente  Promesa, se extraen de forma de un arreglo
    segun la posición de la funcion, y en este caso estamos utilizando la desctructuración para extraer los valores */

    const [usuarios, total] = await Promise.all([
        Usuario.find().skip(desde).limit(5),
        Usuario.countDocuments()
    ]);

                                    
    res.status(200).json({
        ok: true,
        usuarios,
        total
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

        if(!usuarioDB.google){
        campos.email = email;  // Sino es usuario de google  
        }else if (usuarioDB.email !== email){
            return res.status(400).json({
                ok:false,
                msg:'Usuario de google no puede cambiar su correo'
            })
        }
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