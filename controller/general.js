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

module.exports = general