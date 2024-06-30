const { response, request } = require('express');

const {Categoria} = require('../models')

// obtenerCategorias - paginado -  total - populate
const categoriasGet = async (req= request, res = response) => {
    const { limite = 10, desde = 0 } = req.query; 
    const query = {state: true}; 

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("user")
    ]) 

    res.json({
        total,
        categorias
    });
};

// obtenerCategoria - populate {}
const categoriasGetById = async (req= request, res = response) => { 
    
    const id = req.params.id; 

    const categoria = await Categoria.findById(id).populate("user");

    res.json({
        categoria
    });
};

// crear categoria
const categoriasPost = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name});

    // Verificar si la categoria ya existe
    if(categoriaDB) {
        return res.status(400).json({
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

// actualizarCategoria 
const categoriasPut = async (req = request, res = response) => {
    const id = req.params.id;
    
    const {name} = req.body;

    const categoriaDB = await Categoria.findByIdAndUpdate(id, {name: name.toUpperCase()});

    res.json(categoriaDB)

}

// borraCategoria
const categoriasDelete = async (req = request, res = response) => {
    const id = req.params.id;
    const categoriaDB = await Categoria.findByIdAndUpdate(id, {state: false});

    res.json(categoriaDB)
}

module.exports = {
    categoriasPost,
    categoriasGet,
    categoriasGetById,
    categoriasPut,
    categoriasDelete
}