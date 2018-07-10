var db = require('mssql');
var config = require('../config/config.js');

//Catch DB connectivity Errors
 
db.on('error', function(err) {
	if(err) {
		console.log(err);
	}
});

var experts = {};

experts.retrieve = function(req, res){
    db.connect(config)
      .then(function(){
        let q = 'SELECT * FROM tblExperts ORDER BY SubjectMatter';
        return new db.Request().query(q);
      }).then(function(data){
        res.send(data);
      }).catch(function(err){
          res.status(500);
          res.send('Database error');
      });
};

experts.add = function(req, res){
    db.connect(config)
      .then(function(){
         let q = `INSERT INTO tblExperts (SubjectMatter, Expert) VALUES('${req.body.subjectMatter}', '${req.body.expert}')`;
         return new db.Request().query(q); 
      }).then(function(result){
        res.send('Success');
      }).catch(function(err){
          res.status(500);
          res.send('Database error');
      });
};

experts.delete = function(req, res){
  db.connect(config)
  .then(function(){
    let q = `DELETE FROM tblExperts WHERE id=${req.params.id}`
    return new db.Request().query(q);
  }).then(function(result){
    res.send('Deleted '+  req.params.id);
  }).catch(function(err){
      res.status(500).send('Database error');
  });
};



module.exports = experts;