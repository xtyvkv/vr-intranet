var mysql = require('mysql');
var conf = require('../config/mysqlconf');
var sendEmail = require('../helpers/sendemail');

var mssql = require('mssql');
var msconfig = require('../config/config.js');

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

mainctlr.newticket = function(req, res) {
  const pLevels = {
    "0": "LOW",
    "1": "MODERATE",
    "2": "HIGH",
    "3": "EMGCY"
  }

  var {name, subject, priority, message} = req.body;
  priority = pLevels[priority];
  
  var emailMsg = message;

  if (req.files.attachment) {
    var fname = req.files.attachment.name;
    var savePath = __dirname + '/../uploads/' + fname;
    emailMsg += `<br /> <br /> Attachment: ${fname}`;
    let sampleFile = req.files.attachment;
    sampleFile.mv(savePath, function(err) {
      if (err) {
        throw err;
        res.status(500).send('Unable to save attachment');
      }
      res.send('New ticket received and file attachment uploaded!');
    });
  } else {
    var emailMsg = message;
    res.send("New ticket received! " + JSON.stringify({name, subject, priority}))
  }

  this.save(
      name,
      subject,
      message,
      priority,
      fname || ""
    )

  const emailSub = `${name} - ${subject} ${priority}`;
  
  this.getEmailAddress(name)
  .then(function(email){
    console.log('Email: ', email);
    const params = sendEmail.message(email, emailSub, emailMsg);
    sendEmail.send(params);

    const paramsII = sendEmail.message('ereyes@vitalresearch.com', emailSub, emailMsg);
    sendEmail.send(paramsII);

  })
  .catch(function(err){
    const paramsII = sendEmail.message('ereyes@vitalresearch.com', emailSub, emailMsg);
    sendEmail.send(paramsII);
  });

}

mainctlr.getEmailAddress = function (name) {
  return new Promise(function(resolve, reject){
    mssql.connect(msconfig)
    .then(function(pool) {
      return pool.request().query(`SELECT Email FROM tblEmployee WHERE FirstName LIKE '${name}'`)
    })
    .then(function(result){
      mssql.close();
      console.log(result);
      if (result[0]){
        resolve(result[0]["Email"])
      } else {
        reject('no email address found');
      }
    })
    .catch(function(err){
      console.log(err)
      reject('unable to lookup email address');
    })
  })
  
}

mainctlr.save = function(name, subject, message, priority, attachment){
  let qry = `INSERT INTO tblHelpdesk (name, subject, message, priority, attachment, datesubmitted) VALUES ("${name}","${subject}","${message.replace('"','')}","${priority}","${attachment}", CURRENT_TIMESTAMP)`;
  let db = mysql.createConnection(conf);
  db.connect();
  db.query(qry, (err, results) => {
    if(err) { 
      throw err;
    }
  })
  db.end();
}


module.exports = mainctlr;