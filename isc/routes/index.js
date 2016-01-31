var express = require('express');
var router = express.Router();
var path    = require("path");
// connection.connect();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // connection.query('SELECT * FROM employee;', function(err, rows, fields){
  //   if(err) throw err;
  //   //console.log(rows);
  //   var users=JSON.stringify(rows);
  //   console.log(users);
  //   res.render('index', {tiltle: users});
  // });
});

router.get('/login',function(req, res, next){
  res.sendFile(path.join(__dirname+'./../views/login.html'));
});
router.get('/register',function(req, res, next){
  res.sendFile(path.join(__dirname+'./../views/register.html'));
});

module.exports = router;
