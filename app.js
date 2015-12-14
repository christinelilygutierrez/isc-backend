/************** Module Dependencies **************/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

/************** Modules for Database **************/
var mysql = require('mysql');
var render_queries = require('./database/render_api');
var connection  = require('express-myconnection'); 

/************** Setting Views for Jade Pages **************/

// view engine setup. It joins the current directory name with view such as /garre00/Documents/GitHub/isc-backend/views
app.set('views', path.join(__dirname, 'views'));

// Add a template engine with Express
app.set('view engine', 'jade');

/************** Use the Parser for the Jade Pages **************/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/************** Static files like js, CSS, images **************/
// Reference all materials in the public directory
app.use(express.static(path.join(__dirname, 'public'))); 


/************** Routers for Web Pages **************/
// Use the router for the webpages
app.use('/', routes);

/************** Connect to MySQL **************/
// Change password to the password for your local database
var password = 'Grand.garramo88';
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : password,
        port : 3306, //port mysql
        database:'seating_lucid_agency'
    },'request')
);

/************** RESTful API for Webpages **************/
// GET Employees Page. 
app.get('/employees', render_queries.getAllEmployees);

// GET the employee adding page
app.get('/employees/add', render_queries.addEmployee);

// POST to add the employee
app.post('/employees/add', render_queries.confirmEmployee);

// GET the employee to edit
app.get('/employees/edit/:id', render_queries.editEmployee);

// POST to save edits for the employee
app.post('/employees/edit/:id', render_queries.confirmEditEmployee);

// GET the employee to delete
app.get('/employees/delete/:id', render_queries.deleteEmployee);

// GET Desks Page. 
app.get('/desks', render_queries.getAllDesks);

// GET Clusters Page. 
app.get('/clusters', render_queries.getAllClusters);

/************** Queries API for JSON results **************/
var queries = require('./database/queries');
var dbconnect = queries.getConnection(password);
dbconnect.connect(function(err){
  if(!err) {
    console.log("Connected to seating_lucid_agency");
  } else {
    console.log("Error connecting database");    
  }
});
/*queries.getAllEmployees(dbconnect, function(err, data){
  if (err) {
    console.log("ERROR : ", err);            
  } else {            
    console.log("The list of employees : ", data);   
  }    
});
queries.getAllDesks(dbconnect, function(err, data){
  if (err) {
    console.log("ERROR : ", err);            
  } else {            
    console.log("The list of desks : ", data);   
  }    
});
queries.getAllClusters(dbconnect, function(err, data){
  if (err) {
    console.log("ERROR : ", err);            
  } else {            
    console.log("The list of clusters : ", data);   
  }    
});*/
//var values = ['zayn', 'malik', 'oneD@gmail.com', 'password', 'music', 'singer', 10, 4, 2, 'zayn.jpg', 'high'];
//queries.addEmployee(dbconnect, values);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/************** Error Handlers **************/

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Export the app module
module.exports = app;