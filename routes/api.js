var express = require('express');

var router = express.Router();

var board = require('../controller/cont.js');
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

router.get('/ann', function(req, res) {
  board.ann(req, res);
});

router.post('/ann', function(req, res) {
  board.annAdd(req, res);
});

router.put('/ann/:id', function(req, res) {
  board.annDel(req, res)
});


module.exports = router;

