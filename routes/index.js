var express = require('express');
var router = express.Router();
var env = require('../env');

/************** Modules for Database **************/
var mysql = require('mysql');
var render_queries = require('../database/render_api');
var connection  = require('express-myconnection');

/************** Connect to MySQL **************/
// Change password to the password for your local database
var password = '';
router.use(
  connection(mysql, {
    host: env.database.host,
    user: env.database.user,
    password : env.database.pass,
    port : env.database.port, //port mysql
    database: env.database.name
  },'request')
);

/* GET home page. */
router.get('/', function(req, res, next) {
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
