var mysql = require('mysql');
var conf = require('../config/mysqlconf');

var mainctlr = {};

mainctlr.allTickets = function(req, res){
	let db = mysql.createConnection(conf);
	db.connect();
	db.query(`SELECT * FROM tblHelpdesk WHERE status IS NULL ORDER BY datesubmitted DESC`, (err, results) => {
		if(err) { 
			// console.log(err)
			throw err;
		}

		res.render('helpdesk', {ticket: results})
	})
	db.end();

}

mainctlr.ticketInfo = function(req, res){
	let db = mysql.createConnection(conf);
	db.connect();
	db.query(`SELECT * FROM tblHelpdesk WHERE idTicket='${req.params.id}'`, (err, results) => {
		if(err) { 
			// console.log(err)
			throw err;
		}

		res.send(results)
	})
	db.end();	
}

mainctlr.markComplete = function(req, res){
	let db = mysql.createConnection(conf);
	db.connect();
	db.query(`UPDATE tblHelpdesk SET status='completed' WHERE idTicket=${req.params.id}`, (err, results) => {
		if(err) { 
			// console.log(err)
			res.send('fail')
			throw err;
		}
		console.log(results)
		res.send('sucess')
	})
	db.end();
}

module.exports = mainctlr;