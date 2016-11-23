var db = require('mssql');

var config = require('../config/config.js');

var board = {}

board.retrieveInOut = function(req, res) {

	db.connect(config).then(function() {
		new db.Request().query('SELECT EmpID, FirstName, InOffice, OutOffice, Home, Extension FROM tblEmployee WHERE Active = 1 ORDER BY FirstName')
		.then(function(records) {
			console.log(req.originalURL);
			var data = {
				users: records
			};
			
			res.json(data);
		})
		.catch(function(err) {
			console.log(err);
			res.send('Database error');
		});
	});

}

board.updateStatus = function(req, res, empID, newStatus) {
	var s = newStatus;
	var ns;

	switch(s){
		case "in":
			ns="InOffice";
			break;
		case "out":
			ns="OutOffice";
			break;
		case "home":
			ns="Home";
	}

	var qry = "UPDATE tblEmployee SET " + ns + "='1' WHERE EmpID=" + empID + ";" ;

	db.connect(config).then(function(){

		new db.Request().query(qry).then(function(result){
			res.send("updated status");
		})
		.catch(function(err){
			console.log(err);
		});
	});
	
}


board.kitchenDuty = function() {
	db.connect(config).then(function(){
		var qry = "SELECT tblEmployee.FirstName as Name, tblCleanup.CleanDate FROM tblCleanup LEFT JOIN tblEmployee on tblCleanup.EmpID=tblEmployee.EmpID ORDER BY CleanDate";

		db.connect(config).then(function(){
			new db.Request().query(qry).then(function(result){
				console.log(result);
			})
			.catch(function(err){});
		});
	});
}


//Catch DB connectivity Errors

db.on('error', function(err) {
	if(err) {
		console.log(err);
	}
});

// module.exports = retrieveInOut;

module.exports = board;
