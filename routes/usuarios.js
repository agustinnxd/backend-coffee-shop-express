const { check } = require('express-validator');
const { Router } = require('express');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middleware')

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosGetById } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosGetById);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Email inválido').isEmail(),
    check('email').custom( emailExiste ),
    check('password', 'La contraseña debe tener 6 caracteres como mínimo').isLength({ min: 6 }),
    // check('role', 'No es un rol permitido').isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check('role').custom( esRoleValido ),
    validarCampos,
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos       
],usuariosDelete);

module.exports = router;