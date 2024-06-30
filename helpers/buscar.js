const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp( termino, 'i' )

    const usuarios = await Usuario.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{state: true}]
    })

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    };

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({name: regex});

    res.json({
        results: categorias
    });
};

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        });
    };

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({name: regex});

    res.json({
        results: productos
    });
};

module.exports = {
    buscarUsuarios,
    buscarCategorias,
    buscarProductos
}