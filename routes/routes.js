const axios = require('axios')
var express = require('express');
var mongoose = require('mongoose');
process.env.EDAMOM_ID="718c5205";
process.env.EDAMOM_KEY="ba10effb18afdc98b4750044768b3889";
var router = express.Router();
var User = mongoose.model('users');
var Recipe = mongoose.model('recipes');
var controller = require('../controllers/controllers.js');

const { check, validationResult } = require('express-validator');

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* home page */
router.get('/', (req, res) => {

    if (req.session.email){
        res.render("search.ejs",{
            email:req.session.email

        }
        );
    } else {
        res.render("index.ejs");
    }
});

router.get('/signup', function (req, res) {
    res.sendfile("signup.html");


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
            
            req.session.email = userEmail;
            req.session.password = userPassword;
            req.session.name= user.name;
            res.render("search.ejs",{
                name:req.session.name
                


            }
            );
        } else {
            res.write("Please Login");

        }
    });

});



router.get('/displayfavourites', function(req,res){
    var k;
    User.findOne({email:req.session.email}, function(err,user) {
        
        
        k=user._id;
        console.log(k);
      
    var recipeOutput = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><meta name="author" content=""><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><link href="css/normalize.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body>';
    
    Recipe.find({userId:k}, function(err, favourite) {
        
        if (!err) {
            for (var i = 0; i < favourite.length; i++) {
                var recipe = favourite[i];
                const label = recipe.label;
                const image = recipe.image;
                const url = recipe.url;
                recipeOutput += '<li class="favouriteResultOption">';
                recipeOutput += '<div class="object">';
                recipeOutput += '<a class="favouriteResultsLink" href="#">';
                recipeOutput += '<span class="favouriteImgContainer">';
                recipeOutput += '<img class="favouriteImg" src="' + image + '" alt="pastarecipeLink">';
                recipeOutput += '</span>';
                recipeOutput += '</a>';
                recipeOutput += '</div>';
                recipeOutput += '<h3 class="resultsTitle">' + label + '</h3>';
                recipeOutput += '<div class="data">';
                recipeOutput += '<a class="ing" href="#">';
                recipeOutput += '<form action="' + url + '">';
                recipeOutput += '<button type="submit"> View recipe </button>';
                recipeOutput += '</form>';
                recipeOutput += '</a>';
                recipeOutput += '</div>';
            }
            recipeOutput+='<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script><script src="js/script.js"></script></body></html>';
            res.send(recipeOutput);
        } else {
            res.sendStatus(404);
        }
    })

});

});



    router.get('/search', function (req, res) {
        User.findOne({email:req.session.email}, function(err,user) {
        
        
            k=user._id;
            console.log(k);

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
        var recipeOutput = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><meta name="author" content=""><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><link href="css/normalize.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body>';
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
                recipeOutput += '<li class="searchingResultOption">';
                recipeOutput += '<div class="object">';
                recipeOutput += '<a class="searchingResultsLink" href="#">';
                recipeOutput += '<span class="searchingImgContainer">';
                recipeOutput += '<img class="searchingImg" src="' + image + '" alt="pastarecipeLink">';
                recipeOutput += '</span>';
                recipeOutput += '</a>';
                recipeOutput += '</div>';

                recipeOutput += '<h3 class="resultsTitle">' + label + '</h3>';

                recipeOutput += '<div class="data">';
                recipeOutput += '<div class="cal" href="#">';
                recipeOutput += '<span class="info"> Calories: </span>';
                recipeOutput += '<span class="num">' + recipe.calories.toFixed(2) + '</span><br />';
                recipeOutput += '</div>';
                recipeOutput += '</div>';
                recipeOutput += '<form action="/addfavourites" method="post">';
                recipeOutput += '<div class="addButton">';
                recipeOutput += '<input type="hidden"  name="label" id="label" value="' + label + '">';
                recipeOutput += '<input type="hidden"  name="userId" id="userId" value="' + k + '">';
                recipeOutput += '<input type="hidden"  name="image" id="image" value="' + image + '">';
                recipeOutput += '<input type="hidden"  name="url" id="url" value="' + url + '">';
                recipeOutput += '<button type="submit" class="submit"> Add to favorites </button>';
                recipeOutput += '</div>';
                recipeOutput += '</form>';
                recipeOutput += '<form action="' + url + '">'
                recipeOutput += '<button type="submit"> View recipe </button>'
                recipeOutput += '</form>'
                recipeOutput += '</li>';


            }
            recipeOutput+='<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script><script src="js/script.js"></script></body></html>'
            
            res.send(recipeOutput);

         });

        });

        });


router.post('/addfavourites',controller.addRecipe);
router.get('/favourites', controller.findAllfav);
router.get('/favourites/userid/:userid', controller.findfavById);
router.post('/users', controller.createUser);
router.get('/users', controller.findAllUsers);
router.get('/users/id/:id', controller.findOneUser);
router.get('/users/name/:name', controller.findUserByName);

module.exports = router;