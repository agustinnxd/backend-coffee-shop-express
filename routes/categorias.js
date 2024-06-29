const { check } = require('express-validator');
const { Router } = require('express');

const {validarJWT, validarCampos} = require('../middleware');
const { categoriasPost } = require('../controllers/categorias');

const router = Router();

//localhost:8080/api.categorias

// obtener todas las categorias - publico
router.get('/', (req, res)=> {
    res.json('get')
});

// obtener una categoria por id - publico
router.get('/:id', (req, res)=> {
    res.json('get - id')
});

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es necesario').not().isEmpty(),
    validarCampos

], categoriasPost);

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', (req, res)=> {
    res.json('put')
});

// Borrrar - privado - Admin
router.delete('/:id', (req, res)=> {
    res.json('delete')
});

module.exports = router;
