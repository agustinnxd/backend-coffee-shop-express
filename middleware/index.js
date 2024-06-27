

const validaCampos = require('../middleware/validar-campos.js');
const validarJWT = require('../middleware/validar-jwt.js');
const validaRoles = require('../middleware/validar-roles.js');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,

}