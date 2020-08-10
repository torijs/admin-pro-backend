// Este archivo es para poder validar los campos en las que se requira.
const {response} = require('express');
const {validationResult} = require('express-validator'); // para realizar las validaciones de los compos de una manera mas sencilla


const validarCampos = (req, res= response, next) => { // Este sera nuestro middleware para poder realizar algunas validaciones

    const errores = validationResult(req); // Aqui recogemos todos los errores que aya detectado express-validartion
    if(!errores.isEmpty()){// .isEmpty() para comprobar si una cadena esta vacia.
        return res.status(400).json({
            ok:false,
            errors: errores.mapped() // para mayor informacion ver la documentación
        })
    }

    next(); // Si todo esta bien pasamos seguimos adelante con la petición

}

module.exports = {
    validarCampos
}
