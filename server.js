var express = require("express");
var app = express();

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json 
app.use(bodyParser.json());

var morgan = require('morgan');

var exphbs= require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));

var api = require('./routes/api.js');

app.get('/', function(req, res) {
	res.render("index");
});

app.get('/in', function(req, res) {
	res.render("in");
});

app.use('/assets', express.static('assets'));

app.use('/api', api);


app.listen(8180, function () {
	console.log("App running on port 8180");
} );
