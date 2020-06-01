/*eslint-env browser*/
var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var app = express();
var path = require('path');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const session = require('express-session');

app.set("view engine","ejs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(check());
app.use(session({
      secret: 'secret-key',
      resave: false,
      saveUninitialized: false,
}));


require('./models/db.js');

var routes = require('./routes/routes.js');

app.use("/public",express.static(__dirname + "/public"));
app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
});

module.exports = app;