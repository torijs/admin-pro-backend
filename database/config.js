const mongoose = require('mongoose');


const dbConnection = async () => {


    try{
        await mongoose.connect(process.env.DB_CNN,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true
        });

        console.info('DB Online');
    }
    catch{ (error)=> {
        console.log('Error en la conexion a la base de datos: ', error);
    }
    }

}

module.exports = {
    dbConnection
}

