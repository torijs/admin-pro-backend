const fs = require('fs');

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');



const borrarImagen = (path) =>{


    console.log('Este es el path', path);
    console.log('Esto es lo que se optiene : ', fs.existsSync(path));

    if(fs.existsSync(path)){ // Aqui comprobamos de que si existe esta ruta del archivo
        fs.unlinkSync(path); // Aqui borramos el archivo.

    }

};


const actualizarImagen = async(tipo, id, nombreArchivo) => {
    let pathViejo = '';

    switch(tipo){
        case 'medicos':
            const medico = await Medico.findById(id);

            if(!medico){
                console.log('Medico no se encontro un medico');
                return false;
            }
        
            pathViejo = `./uploads/medicos/${medico.img}`;
        
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
            
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                console.log('hospital no se encontro un hospital');
                return false;
            }
        
            pathViejo = `./uploads/hospitales/${hospital.img}`;
        
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                console.log('usuario no se encontro un usuario');
                return false;
            }
        
            pathViejo = `./uploads/usuarios/${usuario.img}`;
        
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();

            return true;
            break;
    }

}

module.exports = {
    actualizarImagen
}