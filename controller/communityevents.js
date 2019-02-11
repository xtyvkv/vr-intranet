const db = require('mssql');

const config = require('../config/config.js');

const communityevents = {};

communityevents.getHastags = function (req, res) {
    let q = `SELECT * FROM lblHashtags`;
    db.connect(config)
        .then(function(result){
            return new db.Request().query(q)
        })
        .then( function (results) {
            res.send(results);
        })
        .catch(function(err){
            console.log('Error: communityevents.js, getHashtags: ',err);
            res.status(500);
            res.send('Server Error: Unable to get hashtags');
        });
}

module.exports = communityevents;