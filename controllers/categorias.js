const { response, request } = require('express');

const {Categoria} = require('../models')

const categoriasPost = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name});

    if(categoriaDB) {
        res.status(400).json({
            msg: `La categoria ${categoriaDB.name} ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.usuario._id
    }

    const categoria = await new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}

module.exports = {
    categoriasPost
}