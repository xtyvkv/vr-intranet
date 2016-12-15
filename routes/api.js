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


router.get ('/kitchen', function(req, res){
  board.kitchenDuty(req, res);
});

module.exports = router;

