

const validaCampos = require('../middleware/validar-campos.js');
const validarJWT = require('../middleware/validar-jwt.js');
const validaRoles = require('../middleware/validar-roles.js');
const validarArchivo = require('../middleware/validar-archivo.js')

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}