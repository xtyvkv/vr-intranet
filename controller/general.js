const db = require('mssql');

const config = require('../config/config.js');

const general = {};

general.empnums = function(req, res) {
    let q = 'SELECT FirstName, LastName, CellPhone, HomePhone, WorkNumber, CallInstructions FROM tblEmployee WHERE Active=1';
    db.connect(config).then(function(result){
        return new db.Request().query(q);
    }).then(function(data){
        res.send(data);
    }).catch(function(err){
        console.log('Error: general.js, empnums: ',err);
        res.status(500);
        res.send('Unable to get employee numbers');
    });
}

general.emergency = function (req, res) {
    let q = `SELECT tblEmployee.FirstName AS Name, tblEmergencyContacts.Contact, tblEmergencyContacts.Relationship, tblEmergencyContacts.HomePhone, tblEmergencyContacts.CellPhone, tblEmergencyContacts.WorkPhone  FROM tblEmergencyContacts LEFT JOIN tblEmployee ON tblEmergencyContacts.EmpID = tblEmployee.EmpID WHERE tblEmployee.Active = 1 ORDER BY tblEmployee.FirstName`;
    db.connect(config)
        .then(function(result){
            return new db.Request().query(q)
        })
        .then(function(data){
            res.send(data);
        })
        .catch(function(err){
            console.log('Error: general.js, emergency contacts: ',err);
            res.status(500);
            res.send('Unable to get Emergency contact numbers');
        });
}
module.exports = general