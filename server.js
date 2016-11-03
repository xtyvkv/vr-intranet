var express = require("express");
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));

var retrieveInOut = require('./controller/cont.js');

app.get('/', function(req, res) {
	res.send("Hello World");
});

app.get('/inout', function (req, res) {
	retrieveInOut(req, res);
});


app.use('/public', express.static('vr-intranet'));



app.listen(3000, function () {
	console.log("App running on port 8080");
} );
