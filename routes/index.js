var express = require('express');
var router = express.Router();
var env = require('../env');
var path = require('path');
var jwt    = require('jsonwebtoken');
var apiError = require('../database/api_errors');

/************** Modules for Database **************/
var mysql = require('mysql');
var render_queries = require('../database/backendtest');
var connection  = require('express-myconnection');

/************** Connect to MySQL **************/
// Change password to the password for your local database
router.use(
  connection(mysql, {
    host: env.database.host, // host name for MySQL
    user: env.database.user, // username for MySQL
    password : env.database.pass, // password for MySQL
    port : env.database.port, //port MySQL
    database: env.database.name // database name for MySQL
  },'request')
);

// Implement Access controller
function requireRole(role) {
  return function(req, res, next) {
    if(req.session.employee && req.session.employee.permissionLevel === role) {
      next();
    } else {
      res.send(403);
    }
  };
}

router.get('/upload', function(req, res, next ){
  res.sendFile(path.join(__dirname+'./../views/upload.html'));
});

// Login
router.get('/login',function(req, res, next){
  res.sendFile(path.join(__dirname+'./../views/login.html'));
});
// router.get('/register',function(req, res, next){
//   res.sendFile(path.join(__dirname+'./../views/register.html'));
// });

/*router.use(function(req, res, next){
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
        console.log(req.decoded);
        req.session.employee = req.decoded;
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
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
  requireRole("user");
  res.render('index', {title: 'Lucid Agency Express Framework Testing'});
});

/************** RESTful API for Webpages **************/
// GET Employees Page.
router.get('/employees', render_queries.getAllEmployees);

// GET the employee adding page
router.get('/employees/add', render_queries.addEmployee);

// POST to add the employee
router.post('/employees/add', render_queries.confirmEmployee);

// GET the employee to edit
router.get('/employees/edit/:id', render_queries.editEmployee);

// POST to save edits for the employee
router.post('/employees/edit/:id', render_queries.confirmEditEmployee);

// GET the employee to delete
router.get('/employees/delete/:id', render_queries.deleteEmployee);

// GET Desks Page.
router.get('/desks', render_queries.getAllDesks);

// GET the desk adding page
router.get('/desks/add', render_queries.addDesk);

// POST to add the desk
router.post('/desks/add', render_queries.confirmDesk);

// GET the desk to edit
router.get('/desks/edit/:id', render_queries.editDesk);

// POST to save edits for the desk
router.post('/desks/edit/:id', render_queries.confirmEditDesk);

// GET the desk to delete
router.get('/desks/delete/:id', render_queries.deleteDesk);

// GET Clusters Page.
router.get('/clusters', render_queries.getAllClusters);

// GET the cluster adding page
router.get('/clusters/add', render_queries.addCluster);

// POST to add the cluster
router.post('/clusters/add', render_queries.confirmCluster);

// GET the cluster to edit
router.get('/clusters/edit/:id', render_queries.editCluster);

// POST to save edits for the desk
router.post('/clusters/edit/:id', render_queries.confirmEditCluster);

// GET the desk to delete
router.get('/clusters/delete/:id', render_queries.deleteCluster);

module.exports = router;
