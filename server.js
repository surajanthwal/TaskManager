
//including necessary modules 
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

//setting port for server
var port = process.env.PORT || 8080;

//necessarry middlewares for all requests
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// configure our routes
require('./app/routes')(app); 

app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;
