const { findByIdAndRemove } = require('../models/medico');
const Medico = require('../models/medico');

const getMedicos = async(req,res) => {

    const medicosDB = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre img');

    res.status(200).json({
        ok:true,
        msg:'Consulta de Medicos Exitoso',
        medicosDB
    });

}

const crearMedico = async(req,res) => {
    const medico = new Medico({
        usuario: req.uid, // Aqui solo asignamos el id.
        ...req.body}); // Los otros datos que viene en ek body se destructuran y el modelo se encarga de tomar los demas datos.

    try{

    const medicoDB = await medico.save();


        res.status(200).json({
            ok:true,
            msg:'Medico creado exitosamente',
            medicoDB
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'Error, No se pudo crear un nuevo Medico',
            error
        });
    }

}

const actualizarMedico = async (req,res) => {

    const idMedico = req.params.id;
    const uid = req.uid;

    try{

        const medicoDB = await Medico.findById(idMedico);

        if(!medicoDB){
            return res.status(400).json({
                ok:false,
                msg:'El id del Medico es Invalido'
            });
        }

            const parametros = {
                ...req.body,
                usuario: uid
            };

            const nuevoMedico = await Medico.findByIdAndUpdate(idMedico, parametros, {new: true});
            
            res.status(200).json({
                ok:true,
                msg:'Datos del medico Actualizados',
                nuevoMedico
            });

    }catch(error){
        res.status(500).json({
            ok:true,
            msg:'Error en la petición del servicio',
            error
        });
    }

}


const borrarMedico = async(req,res) => {

    const idMedico = req.params.id;

    const medicoDB = await Medico.findById(idMedico);

    if(!medicoDB){
        return res.status(400).json({
            ok:false,
            msg:'El id del Medico es Invalido'
        });
    }


    await Medico.findByIdAndRemove(idMedico);

    res.status(200).json({
        ok:true,
        msg:'El medico se elimino exitosamente'
    });

    try{

    }catch(erro){
        res.status(500).json({
            ok:true,
            msg:'Error al tratar de realizar la petición al servicio',
            error
        });
    }

}




module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}