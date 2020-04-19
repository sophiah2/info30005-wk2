var express = require('express');
var mongoose = require('mongoose');
process.env.EDAMOM_ID="718c5205";
process.env.EDAMOM_KEY="ba10effb18afdc98b4750044768b3889";

router = express.Router();
var User = mongoose.model('users');
var controller = require('../controllers/controllers.js');
router.get('/signup', function (req, res) {
    res.sendfile("signup.html");
    
    
});

router.get('/searchpage', function (req, res) {
    res.sendfile("search.html");
    
    
});
router.get('/login', function(req,res){
    res.sendfile("login.html");

});


    router.get('/search', function (req, res) {
        var ing=req.query.Recipe_Search;
        console.log(ing)
        var response = {
          url: 'https://api.edamam.com/search?q=' + ing + '&app_id=' + process.env.EDAMOM_ID + '&app_key=' + process.env.EDAMOM_KEY + '&from=' + 0 + '&to=' + 10,
          method: 'GET'
        }
        console.log("response: ", response);
            const recipeResults = response;
            for (i = 0; i < 9; i++) {
                const recipe = recipeResults.hits[i].recipe;
                const label = recipe.label;
                const image = recipe.image;
                const url = recipe.url;
                const calories = recipe.calories.toFixed(2);
                recipeRender(i, image, label, calories, url);
                console.log("recipes: ", recipe);
                console.log("label: ", label);
                console.log("label: ", image);
                console.log("label: ", url);
                console.log("label: ", calories);
            };

        });




router.post('/users', controller.createUser);
router.get('/users', controller.findAllUsers);
 
// Find one user by id
router.get('/users/id/:id', controller.findOneUser);
 
//Find one user by name
router.get('/users/name/:name', controller.findUserByName);

//Update user's data by name
router.put('/users/name/:name', controller.updateUserByName);

//Update user's data by id
router.put('/users/id/:id', controller.updateUserById);



module.exports = router;