var db = require('mssql');

var config = require('../config/config.js');

var moment = require('moment');
require('moment-range');

var request = require('request');

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
		var qry = "SELECT ItemID, ItemText, ItemDate FROM tblCalendar WHERE ItemDate > GETDATE()-1 AND deleted=0 ORDER BY ItemDate ASC";

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

board.addCalendarEvent = function(req, res) {
	var newEvent = JSON.parse(req.body.json_string);
	
	if(newEvent.multipleDays == false) {
		insertCalItem(newEvent.text, newEvent.eventDate, res);
	} else {
		// console.log(newEvent);
		var weekdays = [];
		var start = newEvent.eventDate;
		var end = newEvent.eventEndDate;
		var range = moment.range(start, end);
		range.toArray('days').forEach(function(el){
			//Filter out weekends
			if(el.weekday() != 0 && el.weekday() != 6 ) {
				weekdays.push(el);
			}
		});

		var longQuery = "";

		weekdays.forEach(function(el){
			// console.log(newEvent.text, el.format());
			var qry = "INSERT INTO tblCalendar (ItemDate, ItemText) VALUES (";
				qry += "'" + el.format("YYYY-MM-DD") + "'";
				qry += " , ";
				qry += "'" + newEvent.text.replace("'", "''") + "'"; //Escape apostrophes
				qry += ");";

			longQuery += qry;
		});

		db.connect(config).then(function(){
			new db.Request().query(longQuery).then(function(result){
				res ? res.send("successfully added new calendar event") : console.log('')
			}).catch(function(err){
				console.log(err);
				res ? res.send("Failed to add the new calendar event") : console.log('');
			});
		})
	}
}

board.delCalendarEvent = function(req, res) {
	var qry = "UPDATE tblCalendar SET deleted=1 WHERE ItemID=" + req.params.id;
	db.connect(config).then(function(){

		new db.Request().query(qry).then(function(result){
			res.send("successfully deleted calendar event");
		})
		.catch(function(err){
			console.log(err);
			res.send("failed to delete calendar event");
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

board.projects = function(req, res) {
	request('http://vrcentral/betas/dpu/api/all.php', function(err, response, body){
		res.send(JSON.stringify(body));
	});
};

board.workloads = function(req, res){
	var qry = "SELECT dept, status FROM tblWorkload";

	db.connect(config).then(function(){
		new db.Request().query(qry).then(function(result){
			res.send(result);
		})
		.catch(function(err){
			console.log(err);
			res.send("unable to get workloads");
		});
	});
};

board.updateWorkload = function(req, res) {
	var qry = "UPDATE tblWorkload SET status=" + req.params.status + " WHERE dept='" + req.params.dept + "'";

	db.connect(config).then(function(){
		new db.Request().query(qry).then(function(result){
			res.send("update workload status");
		})
		.catch(function(err){
			console.log(err);
			res.send("unable to update workloads");
		});
	})
};

board.reset = function(req, res) {
	var qry = "UPDATE tblEmployee SET InOffice=0, OutOffice=1, Home=0 WHERE Active=1";
	db.connect(config).then(function(){
		new db.Request().query(qry).then(function(result){
			res.send("successfully reset");
		})
		.catch(function(err){
			console.log(err);
			res.send("failed to reset");
		})
	});
};

//Catch DB connectivity Errors

db.on('error', function(err) {
	if(err) {
		console.log(err);
	}
});


function insertCalItem(event, date, res) {
	var qry = "INSERT INTO tblCalendar (ItemDate, ItemText) VALUES (";
		qry += "'" + date + "'";
		qry += " , ";
		qry += "'" + event.replace("'", "''") + "'"; //Escape apostrophes
		qry += ")";

		db.connect(config).then(function(){
			new db.Request().query(qry).then(function(result){
				res ? res.send("successfully added new calendar event") : console.log('')
			}).catch(function(err){
				console.log(err);
				res ? res.send("Failed to add the new calendar event") : console.log('');
			});
		})
}


// module.exports = retrieveInOut;

module.exports = board;
