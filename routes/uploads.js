const { check } = require('express-validator');
const { Router } = require('express');

const { validarCampos, validarArchivo } = require('../middleware');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();

router.post('/',validarArchivo, cargarArchivos)

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'id invalido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'id invalido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen)


module.exports = router;