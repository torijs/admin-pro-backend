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

const actualizarMedico = (req,res) => {
    res.status(200).json({
        ok:true,
        msg:' Actulizar Medico'
    });

}


const borrarMedico = (req,res) => {
    res.status(200).json({
        ok:true,
        msg:' borrar Medico'
    });

}




module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}