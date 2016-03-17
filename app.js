/************** Module Dependencies **************/
var api_route = require('./routes/api');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cronJob = require('cron').CronJob;
var email = require('./email/email');
var env = require('./env');
var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var queries = require('./database/queries');
var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

/**************** Database Connection ****************/
var dbconnect = queries.getConnection();
var sess = {
  secret: 'test',
  resave: true,
  saveUninitialized: true,
  employee: {}
};
app.use(session(sess));

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
app.use(function (error, req, res, next){
    var result ={
      'error': true,
      'message': 'invalid json'
    };
    res.status(400).json(result)
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



/************** Static files like js, CSS, images **************/
// Reference all materials in the public directory
app.use(express.static(path.join(__dirname, 'public')));

// apply CORS middleware
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", (req.headers.origin) ? req.headers.origin : '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, X-Requested-With, X-Access-Token, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

/************** Routers for Web Pages **************/
// Use the router for the webpages
app.use('/', routes);
app.use('/api', api_route);
//app.use('/users', users);

/************** Execute Email Jobs **************/
email.emailJobs();

/************** 404 and Error Handlers **************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

var dailyEmailJob = new cronJob( '57 16 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");
  var email;
  queries.reminderUpdateEmail(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      email=data;
    } else {
      email=JSON.parse(JSON.stringify(data));


      for (var i in email) {

        val = email[i];
        console.log(val.email);
        client.sendEmail({
          "From": "djgraca@asu.edu",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to DeskSeeker now to update your profile!"
        });
      }


    }
  });
},  null, true);

var fiveDayEmailJob = new cronJob( '57 16 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");
  var email;
  queries.fiveDayOldAccounts(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      email=data;
    } else {
      email=JSON.parse(JSON.stringify(data));


      for (var i in email) {

        val = email[i];
        console.log(val.email);
        client.sendEmail({
          "From": "djgraca@asu.edu",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to DeskSeeker now to update your profile!"
        });
      }


    }
  });
},  null, true);


var tenDayEmailJob = new cronJob( '57 16 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");
  var email;
  queries.tenDayOrOlderAccounts(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      email=data;
    } else {
      email=JSON.parse(JSON.stringify(data));


      for (var i in email) {

        val = email[i];
        console.log(val.email);
        client.sendEmail({
          "From": "djgraca@asu.edu",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to DeskSeeker now to update your profile!"
        });
      }


    }
  });
},  null, true);


  var quarterlyEmailJob = new cronJob( '30 03 01 */3 *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");
  var email;
  queries.quarterlyUpdateEmail(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      email=data;
    } else {
      email=JSON.parse(JSON.stringify(data));


      for (var i in email) {

        val = email[i];
        console.log(val.email);
        client.sendEmail({
              "From": "djgraca@asu.edu",
              "To": val.email,
              "Subject": "It's Been Awhile...",
              "TextBody": "Looks like you haven't updated your preferences in awhile!  If you need to update please login at DeskSeeker now!"
          });
      }


    }
  });


},  null, true);
// Export the app module
module.exports = app;
