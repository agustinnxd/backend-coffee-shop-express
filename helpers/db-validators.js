

const { Categoria, Producto } = require('../models');
const Role = require('../models/role')
const Usuario = require('../models/usuario');

// Validar usuarios

const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${role} no esta registrado en la base de datos`)
    }
}


const emailExiste = async (email = '') => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya se encuentra registrado`)
    }
}

const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con el id ${id} no existe`)
    }
}

// Validar Categorias

const existeCategoriaPorId = async (id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoria con el id ${id} no existe`)
    }
}

const categoriaExiste = async (name) => {
    const categoria = await Categoria.findOne({ name });
    if (categoria) {
        throw new Error(`La categoría ${name} ya se encuentra en la base de datos`)
    }
}

// Validar Productos

const productoExiste = async (name) => {
    const producto = await Producto.findOne({ name });
    if (producto) {
        throw new Error(`El producto con el nombre ${name} ya se encuentra en la base de datos`)
    }
}

const existeProductoPorId = async (id = '') => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con el id ${id} no existe`)
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    categoriaExiste,
    productoExiste,
    existeProductoPorId
}