const axios = require('axios')
var express = require('express');
var mongoose = require('mongoose');
process.env.EDAMOM_ID="718c5205";
process.env.EDAMOM_KEY="ba10effb18afdc98b4750044768b3889";
router = express.Router();
var User = mongoose.model('users');
var controller = require('../controllers/controllers.js');



const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());



router.get('/signup', function (req, res) {
    res.sendfile("signup.html");
    
    
});

router.get('/searchpage', function (req, res) {
    
    res.sendfile("search.html");
    
    
});
router.get('/login', function(req,res){
    res.sendfile("login.html");

});

router.post('/credentials',  function(req, res) {
    var userEmail = req.body.email;
    var userPassword= req.body.password;
    console.log(userEmail);
    User.findOne({email:userEmail,password:userPassword}, function(err,user) {
        if (!err  && user!=null) {
            console.log(user);
            res.sendfile("search.html");
        } else {
            res.sendfile("login.html");
            
        }
    });
});


    router.get('/search', function (req, res) {
        
        var ing=req.query.Recipe_Search;
        console.log(ing)
        var qurl="https://api.edamam.com/search?q=" + ing + "&app_id=" + process.env.EDAMOM_ID + "&app_key=" + process.env.EDAMOM_KEY + "&from=" + 0 + "&to=" + 10;
        console.log(qurl);
        var buildTheHtmlOutput = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><meta name="author" content=""><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><link href="css/normalize.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body>';
        const res1 = axios.get(qurl);
         const recipes = res1;
        
        recipes.then(function(result) {
            recipeResults=result.data; // "Some User token"
            for (i = 0; i < 9; i++) {
                const recipe = recipeResults.hits[i].recipe;
                const label = recipe.label;
                const image = recipe.image;
                const url = recipe.url;
                const calories = recipe.calories.toFixed(2);
                buildTheHtmlOutput += '<li class="searchRecipeResultOption">';
                buildTheHtmlOutput += '<div class="object">';
                buildTheHtmlOutput += '<a class="searchRecipeResultsLink" href="#">';
                buildTheHtmlOutput += '<span class="searchRecipeImgContainer">';
                buildTheHtmlOutput += '<img class="searchRecipeImg" src="' + recipe.image + '" alt="pastarecipeLink">';
                buildTheHtmlOutput += '</span>';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</div>';
    
                buildTheHtmlOutput += '<h3 class="resultsTitle">' + recipe.label + '</h3>';
    
                buildTheHtmlOutput += '<div class="data">';
                buildTheHtmlOutput += '<a class="cal" href="#">';
                buildTheHtmlOutput += '<span class="num">' + recipe.calories.toFixed(2) + '</span><br />';
                buildTheHtmlOutput += '<span class="info"> calories</span><br />';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '<a class="ing" href="#">';
                buildTheHtmlOutput += '<span class="num">' + recipe.ingredients.length + '</span><br />';
                buildTheHtmlOutput += '<span class="num">' + recipe.url + '</span><br />';
                buildTheHtmlOutput += '<span class="info"> ingredients</span>';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</div>';
    
                buildTheHtmlOutput += '<form action="/addfavourites" method="post">';
                buildTheHtmlOutput += '<div class="addButton">';
                buildTheHtmlOutput += '<input type="hidden" class="title" value="' + recipe.label + '">';
                buildTheHtmlOutput += '<input type="hidden" class="ingredients" value="' + recipe.ingredientLines.toString() + '">';
                buildTheHtmlOutput += '<input type="hidden" class="image" value="' + recipe.image + '">';
                buildTheHtmlOutput += '<input type="hidden" class="url" value="' + recipe.url + '">';
                buildTheHtmlOutput += '<button type="submit" class="addSuccessButton green jsSuccessButton">Add</button>';
                buildTheHtmlOutput += '</div>';
                buildTheHtmlOutput += '</form>';
                buildTheHtmlOutput += '</li>';

                
                console.log("recipes: ", recipe.label);
                console.log("label: ", label);
                console.log("label: ", image);
                console.log("label: ", url);
                console.log("label: ", calories);
                
                
            }
            buildTheHtmlOutput+='<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script><script src="js/script.js"></script></body></html>'
            res.send(buildTheHtmlOutput);
            
         });
         

         
        });



router.post('/addfavourites', );
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