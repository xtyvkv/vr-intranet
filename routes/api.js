var express = require('express');
var router = express.Router();

var board = require('../controller/cont.js');
var helpdesk = require('../controller/main')
// retrieveInOut = require('../controller/cont.js');

router.get('/', function(req, res) {
        res.send("Hello World");
});

router.get('/inout', function (req, res) {
        board.retrieveInOut(req, res);
});

router.put('/update/:empID/:newStatus', function(req, res) {
  var e = req.params.empID;
  var n = req.params.newStatus;
  board.updateStatus(req, res, e, n);
});


router.get ('/kitchen', function(req, res) {
  board.kitchenDuty(req, res);
});

router.get('/calendar', function(req, res) {
  board.Calendar(req, res);
});

router.post('/calendar', function(req, res) {
  board.addCalendarEvent(req, res);
});

router.put('/calendar/:id', function(req, res){
  board.delCalendarEvent(req, res);
});

router.get('/ann', function(req, res) {
  board.ann(req, res);
});

router.post('/ann', function(req, res) {
  board.annAdd(req, res);
});

router.put('/ann/:id', function(req, res) {
  board.annDel(req, res)
});

router.get('/projects', function(req, res){
  board.projects(req, res);
});

router.get('/workloads', function(req,res){
  board.workloads(req, res);
});

router.put('/workloads/:dept/:status', function(req, res){
  board.updateWorkload(req, res);
});

router.get('/ticket/:id', function(req, res){
  helpdesk.ticketInfo(req, res);
})

router.post('/ticket/:id', function(req, res){
  helpdesk.markComplete(req, res);
})

router.post('/newticket', function(req, res){
  res.send(req.body); 
})

router.post('/upload', function (req, res){
   console.log(req.headers)
   if (!req.files){
    return res.status(400).send('No files were uploaded.');
   }
   console.log(req.files);
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.upload;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(__dirname + '/../uploads/' + req.files.upload.name, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
 
    res.send('File uploaded!');
  });
})
module.exports = router;

