const {Schema, model} = require('mongoose');


const UsuarioSchema = new Schema({
    nombre:{
        type:String,
        required: true
    },
    email:{
        type: String,
        requiered: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    img:{
        type:String
    },
    role:{
        type:String,
        required: true,
        default: 'USER_ROLE'
    },
    google:{
        type:Boolean
    },
});


// Es una funcion normal para poder hacer referencia a algunas cosas directa de la función
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...Object} = this.toObject(); // Esto es propio de mongoose, para mas info ir a la documentación.

    Object.uid = _id; // Esta es un configuracion, para que asi se mande los datos y se visualice segun la necesidad.
    return Object;
});

module.exports = model('Usuario', UsuarioSchema);