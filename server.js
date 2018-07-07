var express = require("express");
var fileUploader = require('express-fileupload')
var app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.use(fileUploader());
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
var controller = require('./controller/main')

app.get('/', function(req, res) {
	res.render("index");
});

app.get('/cal', function(req, res) {
	res.render("calendar");
});

app.use('/assets', express.static('assets'));

app.use('/api', api);

app.get('/nl', function(req, res) {
	// res.send('hello')
	res.render('newlayout')
});

app.get('/empnums', function(req, res){
	res.render('empnums');
});

app.get('/tickets', function(req, res){
	controller.allTickets(req, res);
})


app.listen(8180, function () {
	console.log("App running on port 8180");
} );
