const buscar = require('./buscar');
const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...buscar,
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
