/*eslint-env browser*/
var express = require('express');
var bodyParser = require('body-parser');                                     
var serveStatic = require('serve-static');
var app = express();
var path = require('path');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));

require('./models/db.js');

var routes = require('./routes/routes.js');

app.use('/', serveStatic(path.join(__dirname, '/dist')));
app.use('/', routes);



  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
});

module.exports = app;