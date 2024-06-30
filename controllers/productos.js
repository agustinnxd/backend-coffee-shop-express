const { response, request } = require('express');

const {Producto} = require('../models');

const productoGet = async (req = request, res = response) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {state:true};

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .limit(Number(limite))
            .skip(Number(desde))
            .populate("user")
            .populate("category")
    ]);

    res.json({
        total,
        productos
    });
};

const productoGetById = async (req = request, res = response) => {
    const id = req.params.id;

    const producto = await Producto.findById(id).populate("user").populate("category");

    res.json({
        producto
    });
};

const productoPost = async (req = request, res = response) => {
    const {name, category} = req.body;

    nameUpperCase = name.toUpperCase();

    const productoDB = await Producto.findOne({name: nameUpperCase});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto con el nombre ${name} ya existe en la base de datos`
        });
    };

    const data = {
        name: nameUpperCase,
        category,
        user: req.usuario._id
    };

    const producto = await new Producto(data);

    await producto.save();

    res.status(201).json({
        producto
    });
};

const productoPut = async (req = request, res = response) => {
    const id = req.params.id;

    const {state, category, user, ...payload} = req.body;

    const {name, price, disponible} = payload;

    const productoDB = await Producto.findByIdAndUpdate(id, {name: name.toUpperCase(), price, disponible} );

    res.json(productoDB);
};

const productoDelete = async (req = request, res = response) => {
    const id = req.params.id;
    const productoDB = await Producto.findByIdAndUpdate(id, {state: false});

    res.json(productoDB);
};

module.exports = {
    productoGet,
    productoPost,
    productoGetById,
    productoPut,
    productoDelete

}
