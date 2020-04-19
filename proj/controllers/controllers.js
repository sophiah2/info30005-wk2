var mongoose = require('mongoose');
var User = mongoose.model('users');
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
    
    user.save(function(err, newUser) {
        if (!err) {
            res.send(newUser);
        } else {
            res.sendStatus(400);
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
    User.findOne({name:userName}, function(err, user) {
        if (!err) {
            res.send(user);
        } else {
            res.sendStatus(404);
        }
    });
};

//Update user's data by name
//Can't change the name, otherwise, it won't be able to find it
var updateUserByName = function(req, res) {
    var userName = req.params.name;
    User.findOne({name:userName}, function(err, user) {
        if (err) {
            res.sendStatus(404);
        }
        
        user.createdAt = req.body.createdAt;
        user.userId = req.body.userId;
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        

        user.save(function(err) {
            if (err)
                res.sendStatus(404);

            res.send(user);
        });
    });

};

//Update user's data by id
var updateUserById = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.sendStatus(404);
        }
       
        user.createdAt = req.body.createdAt;
        user.userId = req.body.userId;
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save(function(err) {
            if (err)
                res.sendStatus(404);

            res.send(user);
        });
    });
};


//Delete user by id
var deleteUserById = function(req, res) {
    var userId = req.params.id;
    User.findByIdAndRemove(userId, function(err, user) {
        if (!err) {
            res.send("delete user");
        } else {
            res.status(404).send(err);
        }
   });
};

var  addRecipe = function(res, label, image, url, calories, UserId){
    db.Recipe.create({
        label: label,
        image: image,
        url: url,
        calories: calories,
        UserId: UserId
    }).then(function(dbRecipe){
        //console.log(dbRecipe);
        return res.json(dbRecipe);
    })
}



module.exports.createUser = createUser;
module.exports.findAllUsers = findAllUsers;
module.exports.findOneUser = findOneUser;
module.exports.findUserByName = findUserByName;
module.exports.updateUserById = updateUserById;
module.exports.updateUserByName = updateUserByName;
module.exports.deleteUserById = deleteUserById;
module.exports.addRecipe = addRecipe;