var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var database = require('./routes/employees');

// Create the connection to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Grand.garramo88',
    database:'seating_lucid_agency'
});
connection.connect(function(err){
if(!err) {
    console.log("Connected to seating_lucid_agency");  
} else {
    console.log("Error connecting database");    
}
});
connection.end();

var app = express();

// view engine setup. It joins the current directory name with view such as /garre00/Documents/GitHub/isc-backend/views
app.set('views', path.join(__dirname, 'views'));

// Add a template engine with Express
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Reference all materials in the public directory
app.use(express.static(path.join(__dirname, 'public'))); 

// Use the router for the webpages
app.use('/', routes);

// Use the users
app.use('/users', users);

// Use the
//app.use('/database', database);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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