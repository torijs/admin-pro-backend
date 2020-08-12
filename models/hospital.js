const {Schema, model} = require('mongoose');

const HospitalSchema = new Schema({
    nombre:{
        type:String,
        required: true
    },
    img:{
        type:String
    },
    usuario:{
        required: true,
        type:  Schema.Types.ObjectId,
        ref:'Usuario'
    }
}, {collection: 'hospitales'}); // Esto es para poder cambiar el nombre en la bd y aparesca como nosotros queremos


// Es una funcion normal para poder hacer referencia a algunas cosas directa de la función
HospitalSchema.method('toJSON', function(){
    const {__v, ...Object} = this.toObject(); // Esto es propio de mongoose, para mas info ir a la documentación.

    return Object;
});

module.exports = model('Hospital', HospitalSchema);