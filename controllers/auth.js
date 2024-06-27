const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async (req, resp = response) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Si el usuario esta activo

        if (!usuario.state) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if (!validPassword) {
            return resp.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);

        resp.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return resp.status(500).json({
            msg: 'Algo salio mal'
        })
    }

}

module.exports = {
    login
}