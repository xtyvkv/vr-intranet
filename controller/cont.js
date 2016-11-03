var db = require('mssql');

var config = require('../config/config.js');

function retrieveInOut(req, res) {

db.connect(config).then(function() {
	new db.Request().query('SELECT EmpID, FirstName, InOffice, OutOffice, Home FROM tblEmployee WHERE Active = 1 ORDER BY FirstName')
	.then(function(records) {
		res.json(records);
	})
	.catch(function(err) {
		console.log(err);
		res.send('Database error');
	});
});

}

db.on('error', function(err) {
	if(err) {
		console.log(err);
	}
});

module.exports = retrieveInOut;
