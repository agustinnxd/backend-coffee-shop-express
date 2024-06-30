const { response } = require("express");

const {buscarUsuarios, buscarCategorias, buscarProductos} = require('../helpers/buscar')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'role'
];

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    };

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);

            break;
        case 'categorias':
            buscarCategorias(termino,res);

            break;
        case 'productos':
            buscarProductos(termino,res);

            break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
            break;
    };
};

module.exports = {
    buscar
};