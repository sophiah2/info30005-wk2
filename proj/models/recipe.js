const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    ingredients: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    directions: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: false
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;