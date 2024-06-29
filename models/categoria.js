const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'El state es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model( 'Categoria', CategorySchema );