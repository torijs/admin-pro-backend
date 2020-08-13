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
            ok:false,
            msg:'Error, No se pudo crear un nuevo hospital',
            error
        });
    }
}



const actualizarHospital = async(req,res) => {

    const idHospital = req.params.id;
    const uid = req.uid;

    try{

        const hospital = await Hospital.findById(idHospital);

        if(!hospital){
            return res.status(400).json({
                ok:false,
                msg:'El id del Hospital es Invalido'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(idHospital, cambiosHospital, {new:true});

        res.status(200).json({
            ok:true,
            msg:'Datos actualizados Exitosamente',
            hospitalActualizado
        });    
    }
    catch(error){
        res.status(500).json({
            ok:false,
            msg:'Hay un error al tratar de realizar el servicio',
            error
        });    
    }
}


const borrarHospital = async(req,res) => {

    const id = req.params.id;

    try{
        const hospitalDB = Hospital.findById(id);
        if(!hospitalDB){
            res.status(400).json({
                ok:false,
                msg:'Id de hospital no encontrado'
            });
        }

        await Hospital.findByIdAndDelete(id);
        
        res.status(200).json({
            ok:false,
            msg:'EL Hospital ha sido Eliminado Exitosamente',
        });

    }catch(error){
        res.status(500).json({
            ok:false,
            msg:'Error al ejecutar el servicio',
            error
        });
    }

}






module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}