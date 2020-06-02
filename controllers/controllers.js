var mongoose = require('mongoose');
var User = mongoose.model('users');
var Recipe = mongoose.model('recipes');
var express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* For all the user's operation */
// Create new user
var createUser = function(req, res) {

    var user = new User({
        "name":req.body.name,
        "email":req.body.email,
        "password":req.body.password
    });

    User.findOne({email:user.email}, function(err, user1) {
        if (user1) {
            console.log("ccccc");
            res.render("login.ejs", {
                congr: "Sign up with a different email or please ", congr1:""
            });
            
        } else {
            console.log(user1);
            user.save(function (err, newUser) {
                if (!err) {
                    res.render("login.ejs", {
                        congr: "You've successfully registered! Please ", congr1:""
                    });
                } else {
                    res.sendStatus(400);
                }
            });
        }
    });
};

// Find all users
var findAllUsers = function(req, res) {
    User.find(function(err, users) {
        if (!err) {
            res.send(users);
        } else {
            res.sendStatus(404);
        }
    });
};

// Find one user by id
var findOneUser = function(req, res) {
    var userInx = req.params.id;
    User.findById(userInx, function(err, user) {
        if (!err) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    });
};

//Find one user by name
var findUserByName = function(req, res) {
    var userName = req.params.name;
    console.log(userName);
    User.findOne({name:userName}, function(err, user) {
        if (!err) {
            console.log("errrr")
            res.send(user);
        } else {
            res.sendStatus(404);
            console.log("errrr1")
        }
    });
};





//Delete user by id
var deleteUserById = function(req, res) {
    var userId = req.query.id;
    User.findByIdAndRemove(userId, function(err, user) {
        if (!err) {
            res.send("delete user");
        } else {
            res.status(404).send(err);
        }
   });
};


var deleteFavById = function(req, res) {
    var favId = req.params.favId;
    console.log(favId);
    Recipe.findByIdAndRemove(favId, function(err, fav) {
        if (!err) {
            console.log(fav);
            //res.send("deleted fav");
            res.redirect("/displayfavourites")

        } else {
            res.sendStatus(404);
        }
    });

};



var  addRecipe = function(req, res){

    console.log(req.body.userId);
    var recipe = new Recipe({
    "userId":req.body.userId,
    "label":req.body.label,
    "image": req.body.image,
    "url":req.body.url
    });

    recipe.save(function(err, newfav) {
        if (!err) {
            //res.sendFile("addsuccess.html");
            //res.send('<script>alert("Added to favorites!")</script>');
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    });


};

var findAllfav = function(req, res) {
    Recipe.find(function(err, recipes) {
        if (!err) {
            res.send(recipes);
        } else {
            res.sendStatus(404);
        }
    });
};

var findfavById= function(req, res) {
    var favuserid = req.params.userid;
    console.log(favuserid);
    Recipe.find({userId:favuserid}, function(err, favourite) {
        if (!err) {
            console.log(favourite);
            res.send(favourite);
        } else {
            res.sendStatus(404);
        }
    });
};



module.exports.createUser = createUser;
module.exports.findAllUsers = findAllUsers;
module.exports.findOneUser = findOneUser;
module.exports.findUserByName = findUserByName;
module.exports.deleteUserById = deleteUserById;
module.exports.addRecipe = addRecipe;
module.exports.findAllfav = findAllfav;
module.exports.findfavById=findfavById;
module.exports.deleteFavById = deleteFavById;