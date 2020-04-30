// Create database
var mongoose = require('mongoose');

//const dbURI =
// "mongodb+srv://<username>:<password>@cluster0-w4o9c.mongodb.net/";
//copy from CONNECT (MongoDB Atlas)
const dbURI = "mongodb+srv://Aneesh123:Aneesh123@clusteraneesh-7y4we.mongodb.net/test?retryWrites=true&w=majority";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: "foodninja"
};

mongoose.connect(dbURI, options).then(
 () => {
   console.log("Database connection established!");
 },
 err => {
   console.log("cant connect to database ", err);
 }
);

require('./user.js');
require('./recipe.js');


