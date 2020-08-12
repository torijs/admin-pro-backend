const {Router} = require('express');
const {check} = require('express-validator');
const {validarJWT} = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');

const {getMedicos, crearMedico, actualizarMedico, borrarMedico} = require('../controllers/medicos');

const router = Router();


router.get('/', validarJWT, getMedicos);
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El ID del hospital es obligatorio').isMongoId(), // ESte validadción es pra asegurar que sea un id de  mongo
    validarCampos
] ,crearMedico);
router.put('/', actualizarMedico),
router.delete('/', borrarMedico);


module.exports = router;