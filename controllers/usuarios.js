const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models');



const usuariosGet = async (req = request, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });

}

const usuariosPut = async (req = request, res = response) => {

    const id = req.params.id;

    const { _id, password, google, email, ...resto } = req.body;

    // TODO Validar contra BD

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuarioDB)
}

const usuariosPost = async (req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });


    //encriptar la contrasenha
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    })
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate( id, {state: false});

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
}