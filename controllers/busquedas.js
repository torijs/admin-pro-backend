const Usuario = require('../models/usuario')
const Hospital = require('../models/hospital')
const Medico  = require('../models/medico')

const getTodo = async(req, res) => {

    const busqueda = req.params.busqueda;

    const regex = RegExp(busqueda, 'i'); // Expresion regular

    const [usuarios, medicos, hospitales] =await Promise.all([ // Estamos haciendo las busquedas al mismo tiempo
        Usuario.find({nombre: regex}),
        Medico.find({nombre: regex}),
        Hospital.find({nombre: regex})
    ]);

    try{
        res.status(200).json({
            ok:true,
            msg:'Petición Exitosa',
            usuarios,
            medicos,
            hospitales
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msj:'No se pudo realizar la peticion',
            error
        });

    }
}

const getDocumentosColeccion = async (req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = RegExp(busqueda, 'i'); // Expresion regular
    let data = [];

    try {

        switch (tabla) {
            case 'medicos':
                data = await Medico.find({nombre: regex})
                                    .populate('usuario', 'nombre, img')
                                    .populate('hospital', 'nombre, img');
                break;

            case 'hospitales':
                data = await Hospital.find({nombre: regex})
                                    .populate('usuario', 'nombre, img');
                break;

            case 'usuarios':
                data = await Usuario.find({nombre: regex})
                break;

            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'La selección de la tabla es obligatorio'
                });
        }
        res.status(200).json({
            ok: true,
            msg: 'Petición Exitosa',
            data
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: 'No se pudo realizar la peticion',
            error
        });

    }
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}