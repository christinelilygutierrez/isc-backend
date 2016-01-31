var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var env = require('../env/env');
var apiError= require('../data/api_errors');
var queries = require('../data/queries');

router.post('/authenticate', function(req, res){
  //console.log(req.body);
  var user=null;
  try {
    user=JSON.parse(JSON.stringify(req.body));
  } catch (e) {
    res.json(apiError.errors("401","problems parsing json"));
  }
  var u= user.username;
  var p= user.password;

  //console.log(u);
  //console.log(p);

  if(u===undefined|| u===null || p===undefined || p===null){
    // console.log("missing parameters");
    res.json(apiError.errors("401", "Missing parameters"));
  }
  else{
    queries.getUser(dbconnect, user, function(err, rows){
      if(!err){
          // console.log(JSON.stringify(result));
          if(rows.length < 1){
              res.json({ success: false, message: 'Authentication failed. User not found.' });
          }
          else {
            //console.log(rows);
            var dbUser=JSON.parse(JSON.stringify(rows[0]));
            //console.log(dbUser);

            //I am going to replace this with password encryption validator
            if(dbUser.username===u && dbUser.password===p){
                //res.json(user);
                var token = jwt.sign(user, "test", {
                  expiresIn: "1d" // expires in 24 hours
                });
                    res.json({
                 success: true,
                 message: 'Enjoy your token!',
                 token: token
             });
            }
            else{
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
          }

      }
      else{
            res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
    });
  }
  //res.json(user);
});


router.post('/register', function(req, res){
  console.log(req.body);
  var user=null;
  try {
    user=JSON.parse(JSON.stringify(req.body));
  } catch (e) {
    res.json(apiError.errors("401","problems parsing json"));
  }
  var u= user.username;
  var p= user.password;

  if(u===undefined|| u===null || p===undefined || p===null){
    // console.log("missing parameters");
    res.json(apiError.errors("401", "Missing parameters"));
  }
  else{
    queries.saveUser(dbconnect, user, function(err){
      if(err){
        res.json({ success: false, message: 'Registration failed' });
      }else{
        res.json({ success: true, message: 'Sucessfuly registered user '+ user.username.toString()});
      }
    })
  }

});


router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
   // decode token
   if (token) {
     // verifies secret and checks exp
     jwt.verify(token, 'test', function(err, decoded) {
       if (err) {
         return res.json({ success: false, message: 'Failed to authenticate token.' });
       } else {
         // if everything is good, save to request for use in other routes
         req.decoded = decoded;
         next();
       }
     });

   } else {

     // if there is no token
     // return an error
     return res.status(403).send({
         success: false,
         message: 'No token provided.'
     });

   }
});


var dbconnect = queries.getConnection();
dbconnect.connect(function(err){
  if(!err) {
    console.log("Connected to database");
  } else if (env.logErrors) {
    console.log("Error connecting database", err);
  } else {
    console.log("Error connecting database");
  }
});

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
router.get('/seed', function(req, res){
  queries.seedUsers(dbconnect);
  res.render("seed");
});

router.get('/users', function(req, res){
var users=[];
queries.getUsers(dbconnect, function(err, rows){
  if(!err){
    res.json(rows);
  }
  else{
    res.json(users);
  }
});

});

router.get('/authenticate', function(req, res){
  res.json(apiError.errors("403","denied"));
});
module.exports = router;
