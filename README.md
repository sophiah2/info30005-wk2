# Test-Kitchen

## :rice:Hungry? get searching!:dumpling:
<br>

* [TestKitchen on Heroku](https://test-kitchen-app.herokuapp.com)

* Not knowing what to cook for dinner is a problem faced by all kinds of people. Often, we have limited ingredients at hand and not much time to run to the shops. Or, sometimes we have many ingredients, but cannot decide on which to cook with. Or, even more common, we are overwhelmed at the sheer magnitude of recipe options on the internet. In all these scenarios, having a platform to get quick and handy recipe suggestions would be a welcome improvement to the current format of manually browsing the web. Furthermore, in a time where there is a startling amount of food wastage, having a solution that thinks of creative ways to combat this is of importance. This is where our application Test Kitchen comes in where you add in your ingredients and get cooking.



## Features

* A **search** functionality allowing the user to **filter** through a list of dietary and health option to look for food recipes based on their search.

* The website also features an interactive **login** and **sign-up** function which allows the user to create an account using their own credentials. 

* The website also allows you to add your favourite recipes to look up later like a recipe diary.
<br>

## Details about each feature
### Login/Sign-up (user-related features)
#### Routes
* Creating a new user
```
router.post('/users', controller.createUser);
```
* Finding all the users
```
router.get('/users', controller.findAllUsers);
```
* Find a particular user by id
```
router.get('/users/id/:id', controller.findOneUser);
```
* Find a particular user by name
```
router.get('/users/name/:name', controller.findUserByName);
```
* Update a user's data by name
```
router.put('/users/name/:name', controller.updateUserByName);
```
<br>

#### Controllers
* Creating a new user
```
createUser
```
* Finding all the users
```
findAllUsers
```
* Find a particular user by id
```
findOneUser
```
* Find a particular user by name
```
findUserByName
```
* Delete a user by id
```
deleteUserById
```
<br>

#### Models
#### user.js
```
var userSchema = mongoose.Schema(
    {
        "name": { type: String, required: true },
        "email": { type: String, required: true },
        "password": { type: String, required: true },
    }
);
var users = mongoose.model('users', userSchema);
```
<br>


<br>

### Search and Filtering for Results
#### Routes
* Searching for recipes
```
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
                recipeOutput += '<input type="hidden"  name="userId" id="userId" value="' + currentuser + '">';
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
            console.log(currentuser)
            res.send(recipeOutput);

         });



        });
```

<br>

### Favourites
#### Routes
* Adding favourites via add button
```
router.post('/addfavourites',controller.addRecipe);
```
* Finding all favourites regardless of users
```
router.get('/favourites', controller.findAllfav);
```
* Finding favourites of user via id
```
router.get('/favourites/userid/:userid', controller.findfavById);
```
* displaying user favourites
```
router.get('/displayfavourites', function(req,res){
    var recipeOutput = '<!DOCTYPE html><html><head><meta charset="utf-8"><title></title><meta name="author" content=""><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1"><link href="css/normalize.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet"></head><body>';
    Recipe.find({userId:currentuser}, function(err, favourite) {
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

```


#### Controllers
* adding favourites
 ```addRecipe
 ```
 * Finding all favourites
 ```
 findAllfav
 ```
 * Finding favourites by userID
 ```
 findfavById
 ```
 <br>


#### Models
#### recipe.js
```
var RecipeSchema = mongoose.Schema(
    {
    "userId":{ type: String, required: true },
    "label":{ type: String, required: true },
    "image": { type: String, required: true },
    "url":{ type: String, required: true } 
    }
);

var recipes = mongoose.model('recipes', RecipeSchema);
```
