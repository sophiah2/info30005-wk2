const axios = require('axios')
var express = require('express');
var mongoose = require('mongoose');
process.env.EDAMOM_ID="718c5205";
process.env.EDAMOM_KEY="ba10effb18afdc98b4750044768b3889";
var router = express.Router();
var User = mongoose.model('users');
var Recipe = mongoose.model('recipes');
var controller = require('../controllers/controllers.js');
var currentuser;
const { check, validationResult } = require('express-validator');

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* home page */
router.get('/', (req, res) => {

    if (req.session.email){
        req.redirect("welcome.ejs");
    } else {
        res.render("index.ejs");
    }
});

router.get('/signup', function (req, res) {
    res.sendfile("signup.html");


});

router.get('/searchpage', function (req, res) {

    res.sendfile("search.html");


});

router.get('/logout', function (req, res) {

    req.session.destroy();
    res.redirect('/');

});


router.get('/login', function(req,res){

    res.sendfile("login.html", {success: false, errors: req.session.errors});
    req.session.errors = null;

});

router.post('/credentials', [
    check('email').isEmail(),
    check('password').isLength({ min: 3 })
],  function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() })

    }

    const userEmail = req.body.email;
    const userPassword = req.body.password;

    User.findOne({email:userEmail,password:userPassword}, function(err,user) {
        if (!err  && user!=null) {
            currentuser=user._id;
            req.session.email = userEmail;
            req.session.password = userPassword;
            res.render("welcome.ejs",{
                email:req.session.email
            });
        } else {
            res.write("Please Login");

        }
    });

});



router.get('/displayfavourites', function(req,res){
    var buildTheHtmlOutput = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><meta name="author" content=""><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><link href="css/normalize.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body>';
    Recipe.find({userId:currentuser}, function(err, favourite) {
        if (!err) {
            for (var i = 0; i < favourite.length; i++) {
                var recipe = favourite[i];
                const label = recipe.label;
                const image = recipe.image;
                const url = recipe.url;

                buildTheHtmlOutput += '<li class="searchRecipeResultOption">';
                buildTheHtmlOutput += '<div class="object">';
                buildTheHtmlOutput += '<a class="searchRecipeResultsLink" href="#">';
                buildTheHtmlOutput += '<span class="searchRecipeImgContainer">';
                buildTheHtmlOutput += '<img class="searchRecipeImg" src="' + image + '" alt="pastarecipeLink">';
                buildTheHtmlOutput += '</span>';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</div>';

                buildTheHtmlOutput += '<h3 class="resultsTitle">' + label + '</h3>';

                buildTheHtmlOutput += '<div class="data">';

                buildTheHtmlOutput += '<a class="ing" href="#">';
                buildTheHtmlOutput += '<span class="num">' + recipe.url + '</span><br />';
                buildTheHtmlOutput += '</a>';
                buildTheHtmlOutput += '</div>';
            }
            buildTheHtmlOutput+='<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script><script src="js/script.js"></script></body></html>';
            res.send(buildTheHtmlOutput);
        } else {
            res.sendStatus(404);
        }
    })



});



    router.get('/search', function (req, res) {

        var ing=req.query.Recipe_Search;
        var diet="&diet=";
        if (req.query.diet=="none") {
            diet="";
        } else {
            diet = diet + req.query.diet;
        }
        var health="&health=";
        if (req.query.health=="none") {
            health="";
        } else {
            health = health + req.query.health;
        }
        console.log(ing)
        var qurl="https://api.edamam.com/search?q=" + ing + "&app_id=" + process.env.EDAMOM_ID + "&app_key=" + process.env.EDAMOM_KEY + "&from=" + 0 + "&to=" + 10 + diet + health;
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
                buildTheHtmlOutput += '<input type="hidden"  name="label" id="label" value="' + recipe.label + '">';
                buildTheHtmlOutput += '<input type="hidden"  name="userId" id="userId" value="' + currentuser + '">';
                buildTheHtmlOutput += '<input type="hidden"  name="image" id="image" value="' + recipe.image + '">';
                buildTheHtmlOutput += '<input type="hidden"  name="url" id="url" value="' + recipe.url + '">';
                buildTheHtmlOutput += '<button type="submit" class="submit">Add</button>';
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
            console.log(currentuser)
            res.send(buildTheHtmlOutput);

         });



        });



router.post('/addfavourites',controller.addRecipe);
router.get('/favourites', controller.findAllfav);
router.get('/favourites/userid/:userid', controller.findfavById);
router.post('/users', controller.createUser);
router.get('/users', controller.findAllUsers);

// Find one user by id
router.get('/users/id/:id', controller.findOneUser);

//Find one user by name
router.get('/users/name/:name', controller.findUserByName);




module.exports = router;