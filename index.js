const dotenv = require('dotenv');
const express = require('express');
const {dbConnection} = require('./database/config'); // Importacion de la base de datos.
const cors = require('cors');
const morgan = require('morgan');

// Servidor
let app = express();

// configuracion de CORS

app.use(cors());

// Lectura y parseo del body.
app.use(express.json());
app.use(express.urlencoded({extended:false})); // Nose para que sirve jajaja

// Para poder por terminal todas la peticiones que se estan realizando.
app.use(morgan("dev"));

// Dotenv
dotenv.config();

// Base de datos;
dbConnection();


// Rutas bases
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));



// Credenciales base de datos: url = 'mongodb+srv://juan:toribio1997@mongodb1-fji5w.mongodb.net/psicouta?retryWrites=true&w=majority';


app.listen(process.env.PORT,()=>{

    console.log('Escuchando en el puert jts:  ',process.env.PORT);

})
