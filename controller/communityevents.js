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

communityevents.events = function(req, res) {
    let q = `
    SELECT 
        tblCommunityEvents.eventId, 
        tblCommunityEvents.event_name,
        tblCommunityEvents.date,
        tblCommunityEvents.location,
        tblCommunityEvents.notes,
        tblEmployee.FirstName AS name
    FROM tblCommunityEvents 
    LEFT JOIN tblEmployee ON tblEmployee.EmpID=tblCommunityEvents.empId
    `;
    db.connect(config)
        .then(function(result){
            return new db.Request().query(q);
        })
        .then(function(data){
            res.send(data);
        })
        .catch(function(err){
            console.log('Error: communityevents.js, events: ',err);
            res.status(500);
            res.send('Server Error: Unable to get community events');
        });
}

communityevents.eventhashtags = function(req, res) {
    let eventId = req.params.eventId;
    let q = `
    SELECT tblHashtagsLog.event_id, 
        lblHashtags.hashtag_name AS name 
    FROM tblHashtagsLog 
    LEFT JOIN lblHashtags ON tblHashtagsLog.hashtag_id=lblHashtags.hashtag_id
    WHERE event_id=2
    `;
    db.connect(config)
        .then(function(result) {
            return new db.Request().query(q)
        })
        .then(function(data) {
            let hashtags = [];
            data.forEach(e => hashtags.push(e['name'].trim()))
            res.send(hashtags);
        })
        .catch(function(err){
            console.log('Error: communityevents.js, eventhashtags: ',err);
            res.status(500);
            res.send('Server Error: Unable to get event hashtags');
        });

}

communityevents.create = function(req, res) {
    console.log(req.body);
    res.send(req.body);
}

module.exports = communityevents;