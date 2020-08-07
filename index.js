const dotenv = require('dotenv');
const express = require('express');
const {dbConnection} = require('./database/config'); // Importacion de la base de datos.
const cors = require('cors');

// Servidor
let app = express();

// configuracion de CORS
app.use(cors());


// Dotenv
dotenv.config();

// Base de datos;
dbConnection();

app.get('/mexico', (req, res) => {

    res.status(200).json({mensaje: 'Hello world'})
})

// Credenciales base de datos: url = 'mongodb+srv://juan:toribio1997@mongodb1-fji5w.mongodb.net/psicouta?retryWrites=true&w=majority';


app.listen(process.env.PORT,()=>{

    console.log('Escuchando en el puert jts:  ',process.env.PORT);

})
