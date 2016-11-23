var express = require("express");
var app = express();
var morgan = require('morgan');

var api = require('./routes/api.js');

var exphbs= require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));

app.get('/', function(req, res) {
	res.render("index");
});

app.use('/assets', express.static('assets'));

app.use('/api', api);


app.listen(8080, function () {
	console.log("App running on port 8080");
} );
