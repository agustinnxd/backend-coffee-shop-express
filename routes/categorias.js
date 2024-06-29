const { check } = require('express-validator');
const { Router } = require('express');

const {validarJWT, validarCampos, tieneRole} = require('../middleware');
const { categoriasPost, categoriasGet, categoriasGetById, categoriasPut, categoriasDelete } = require('../controllers/categorias');
const { existeCategoriaPorId, categoriaExiste } = require('../helpers/db-validators');

const router = Router();

//localhost:8080/api.categorias

// obtener todas las categorias - publico
router.get('/', categoriasGet);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],categoriasGetById);

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    validarCampos

], categoriasPost);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    check('name').custom(categoriaExiste),
    validarCampos
],categoriasPut);

// Borrrar - privado - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
],categoriasDelete);

module.exports = router;
