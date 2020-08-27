const {Router} = require('express');
const {check} = require('express-validator'); // Nos ayudadra para realizar las validaciones.
                                               // Los valores del error los recogemos en el controller por medio de otro metodo de la funcion. actualizarUsuario 
const {validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario} = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');
const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');
const router = Router();


router.get('/', validarJWT, getUsuarios);
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Aqui le decimos que revise estos campos ya que no deben de ir vacios.
    check('password', 'El password es obligatorio').not().isEmpty(), // Les pasamos como segundo argumento el msg personalizado
    check('email', 'El correo es obligatorio.').isEmail(), // Aqui le decimos que este campo tiene que ser un correo
    validarCampos // colocamos al ultimo este middleware porque en este punto ya se generaron los checks de arriba
    ] ,crearUsuario);
router.put('/:id',[
    validarJWT,
    //validarADMIN_ROLE, // lo ponemos despues, ya que en el aterior se  guarda el id que en este middleware se ocupa
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El Email es obligatorio').isEmail(),
    check('role', 'El Rol es obligatorio.').not().isEmpty(),
    validarCampos
], actualizarUsuario);
router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;