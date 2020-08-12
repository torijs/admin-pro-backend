const {Router} = require('express');

const expressFileUpload = require('express-fileupload'); // Para subir archivos

const {validarJWT} = require('../middlewares/validar-jwt');
const {fileUpload, retornaImagen} =require('../controllers/uploads');

const router = Router();
router.use(expressFileUpload()); // Lo inicializamos

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImagen);










module.exports = router;