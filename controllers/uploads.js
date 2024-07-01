const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers/subir-archivo");
const { Producto, Usuario } = require('../models');
const { TIMEOUT } = require("dns");




const cargarArchivos = async (req, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el id ${id} no existe` })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el id ${id} no existe` })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save()

    res.json({ modelo })

}

const actualizarImagenCloudinary = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el id ${id} no existe` })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el id ${id} no existe` })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if(modelo.img){
        const nombreCortado = modelo.img.split('/');
        const nombre = nombreCortado[nombreCortado.length-1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url
    
    await modelo.save()

    res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el id ${id} no existe` })
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el id ${id} no existe` })
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        return res.json({
            img: modelo.img
        })
    }

    noImgPath = path.join(__dirname, '../assets/no-image.jpg')

    res.sendFile(noImgPath)
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}