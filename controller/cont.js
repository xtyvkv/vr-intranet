var db = require('mssql');

var config = require('../config/config.js');

var moment = require('moment');

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
			// res.send('Database error');
			res.send("Request to ", req.url, " failed");
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
		case "remote":
			ns="Home";
	}

	var qry = "UPDATE tblEmployee SET " + ns + "='1' WHERE EmpID=" + empID + ";" ;

	db.connect(config).then(function(){

		new db.Request().query(qry).then(function(result){
			res.send("updated status");
		})
		.catch(function(err){
			console.log(err);
			res.send("Request to "+ req.url + " failed");
		});
	});
	
}


board.kitchenDuty = function(req, res) {
	var thisMonday = moment().startOf('week');
	// console.log(thisMonday);
	db.connect(config).then(function(){
		var qry = "SELECT TOP 1 tblEmployee.FirstName as Name, tblCleanup.CleanDate FROM tblCleanup LEFT JOIN tblEmployee on tblCleanup.EmpID=tblEmployee.EmpID WHERE tblCleanup.CleanDate <= GETDATE() ORDER BY CleanDate DESC";

		new db.Request().query(qry).then(function(result){
			// console.log(result);
			result.length > 0 ? res.send(result[0].Name) : res.send("No One");
		})
		.catch(function(err){
			console.log(err);
			res.send("Request to ", req.url, " failed");
		});
	});
}

board.Calendar = function(req, res) {
	var thisMonday = moment().startOf('week');
	// console.log(thisMonday);
	db.connect(config).then(function(){
		var qry = "SELECT ItemText, ItemDate FROM tblCalendar WHERE ItemDate >= GETDATE() ORDER BY ItemDate ASC";

		new db.Request().query(qry).then(function(result){
			// console.log(result);
			res.send(result);
		})
		.catch(function(err){
			console.log(err);
			res.send("Request to ", req.url, " failed");
		});
	});
}

board.ann = function(req, res) {
	var thisMonday = moment().startOf('week');
	// console.log(thisMonday);
	db.connect(config).then(function(){
		var qry = "SELECT id, text FROM tblAnn WHERE deleted=0 AND date BETWEEN GETDATE()-14 AND GETDATE() ORDER BY date DESC";

		new db.Request().query(qry).then(function(result){
			// console.log(result);
			res.send(result);
		})
		.catch(function(err){
			console.log(err);
			res.send("Request to ", req.url, " failed");
		});
	});
}

board.annAdd = function(req, res) {
	var msg = req.body.msg.replace("'", "''"); //Escape apostrophes
	var qry = "INSERT INTO tblAnn (text, date) VALUES ('" + msg + "', CURRENT_TIMESTAMP)"
	db.connect(config).then(function(){
		new db.Request().query(qry).then(function(result){
			res.send("New announcement added successfully");
		})
		.catch(function(err){
			console.log(err);
			res.send("failed to add announcement");
		});
	});
};

board.annDel = function(req, res) {
	var qry = "UPDATE tblAnn SET deleted=1 WHERE id=" + req.params.id;

	db.connect(config).then(function(){

		new db.Request().query(qry).then(function(result){
			res.send("successfully deleted announcement");
		})
		.catch(function(err){
			console.log(err);
			res.send("failed to delete announcement");
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
