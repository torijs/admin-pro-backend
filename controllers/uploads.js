const { v4: uuidv4 } = require('uuid'); // para generar un nombre aleatorio
const {actualizarImagen} =require('../helpers/actualizar-imagen');

const path = require('path'); // Este ya viene por defecto. Nos servira para construir un path completo.
const fs = require('fs'); // Para saber si un archivo o ruta existe.

const fileUpload = async (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    try {

        if (!tiposValidos.includes(tipo)) { // Para hacer un analisis si esta dentro del arreglo
            return res.status(400).json({
                ok: false,
                msg: 'EL tipo seleccionado no es permitido'
            });
        }

        // Validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send({
                ok: false,
                msg: 'No hay mingun archivo seleccionado'
            });
        }


        // Procesar imagen
        const file = req.files.imagen;


        // Extraccion de la extesion del Archivo.
        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Validar Extendion
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).send({
                ok: false,
                msg: 'Extension de archivo no valido'
            });
        }

        // Generar nombre de archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        // Path para guardar la imagen.
        const path = `./uploads/${tipo}/${nombreArchivo}`;

        // Mover la imagen a la carperta deseada segun el path
        file.mv(path, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    ok: false,
                    msg: 'Error el tratar de subir el archivo',
                    err
                });
            }
        });


        // Actualizar en la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.status(200).json({
            ok: true,
            msg: 'Subida de archivos exitosa',
            nombreArchivo,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al utilizar el servicio',
            error
        });
    }

}

const retornaImagen =  (req, res) => {

    let pathImg = '';
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`); // Nos ayudar a autocompletar la ruta.


    // imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }


}




module.exports = {
    fileUpload,
    retornaImagen
}