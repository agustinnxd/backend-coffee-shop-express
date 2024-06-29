const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSignIn = async ( req, res = response ) => {

    const {id_token} = req.body;

    try {
        const { name, picture, email } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ email });

        //Si el usuario no existe se lo carga a la DB
        if (!usuario){
            const data = {
                name,
                email,
                password: ':P',
                img: picture,
                google: true,
                role: 'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario esta borrado de la base de datos devuelve un status(401)
        if (!usuario.state){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    

}

module.exports = {
    login,
    googleSignIn
}