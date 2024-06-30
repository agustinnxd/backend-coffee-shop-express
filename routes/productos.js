const { check } = require('express-validator');
const { Router } = require('express');

const {validarJWT, validarCampos, tieneRole} = require('../middleware');
const { productoPost, productoGet, productoGetById, productoPut, productoDelete } = require('../controllers/productos');
const { existeCategoriaPorId, productoExiste, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//localhost:8080/api.categorias

// obtener todas las categorias - publico
router.get('/', productoGet);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],productoGetById);

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    check('category', 'La categoria es necesaria').not().isEmpty(),
    check('category', 'El ID de la categoria es invalido').isMongoId(),
    check('category').custom( existeCategoriaPorId ),
    validarCampos

], productoPost);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('name').custom(productoExiste),
    validarCampos
],productoPut);

// Borrar - privado - Admin
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
],productoDelete);

module.exports = router;
