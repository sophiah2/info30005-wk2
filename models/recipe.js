var mongoose = require('mongoose');
var RecipeSchema = mongoose.Schema(
    {
    "userId":{ type: String, required: true },
    "label":{ type: String, required: true },
    "image": { type: String, required: true },
    "url":{ type: String, required: true } 
    }
);

var recipes = mongoose.model('recipes', RecipeSchema);