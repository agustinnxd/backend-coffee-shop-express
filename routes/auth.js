const { check } = require('express-validator');
const { Router } = require('express');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login);

router.post('/google', [
    check('id_token', 'Token de google es necesaria').not().isEmpty(),
    validarCampos
],googleSignIn);

module.exports = router;
