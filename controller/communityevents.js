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

    db.connect(config)
        .then(function(result){
            let lookup = `
                SELECT EmpID FROM tblEmployee WHERE FirstName LIKE '${req.body.name}'
            `;
            return new db.Request().query(lookup)
        })
        .then(function(data){
            let empId = data[0]["EmpID"];
            let q = `
            INSERT INTO tblCommunityEvents (
                event_name
                ,empId
                ,date
                ,location
                ,notes
            )
            VALUES (
                '${req.body["event-name"]}'
                ,'${empId}'
                ,'${req.body["date"]}'
                ,'${req.body["event-location"]}'
                ,'${req.body["notes"] || ''}'
            )
            `;
            
            return new db.Request().query(q)
        })
        .then(function(result){
            console.log(result);
            res.send(req.body);
        })
        .catch(function(err){
            console.log('Error: communityevents.js, create event: ',err);
            res.status(500);
            res.send('Server Error: Unable to create event');
        });
}

module.exports = communityevents;