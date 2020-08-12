const Hospital = require('../models/hospital');


const getHospitales = async(req,res) => {

    const hospitalesDB = await Hospital.find().populate('usuario', 'nombre img');


    res.status(200).json({
        ok:true,
        msg:'Consulta exitosa de hospitales',
        hospitalesDB

    });

}

const crearHospital = async (req,res) => {

    const hospital = new Hospital({
        usuario: req.uid, // Aqui solo asignamos el id.
        ...req.body}); // Los otros datos que viene en ek body se destructuran y el modelo se encarga de tomar los demas datos.

    try{

    const hospitalDB = await hospital.save();

        res.status(200).json({
            ok:true,
            msg:'Hospital creado exitosamente',
            hospitalDB
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'Error, No se pudo crear un nuevo hospital',
            error
        });
    }
}



const actualizarHospital = (req,res) => {
    res.status(200).json({
        ok:true,
        msg:' Actulizar hospital'
    });

}


const borrarHospital = (req,res) => {
    res.status(200).json({
        ok:true,
        msg:' borrar hospital'
    });

}






module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}