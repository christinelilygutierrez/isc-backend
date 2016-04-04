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
var queries = require('./database/all_queries');
var routes = require('./routes/index');
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

var deletePasswordResetTokens = new cronJob( '00 12 * * *', function(){
  queries.deletePasswordResetTimeout(dbconnect);
}, null, true);

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






var emps;

var pairs=[];

var pairScores=[];

function pluckByID(inArr, ID)
{
  for (var i = 0; i < inArr.length; i++ )
  {
    if (inArr[i].employeeID === ID)
    {
      return true;
    }
  }
  return false;
};


function callTeam(ID1, ID2, score, total, officeID){

  queries.getAllTeammatesForOneEmployee(dbconnect, ID1, function(err, data1) {

    queries.getAllTeammatesForOneEmployee(dbconnect, ID2, function(err, data2) {


      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)){
        score+=7;
      }
      else{
        score+=0;
      }
      callBlackList(ID1, ID2, score, total, officeID);

    });

  });




}

function callBlackList(ID1, ID2, score, total, officeID){

  queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, ID1, function(err, data1) {
    queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, ID2, function(err, data2) {

      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)){
        score-=5;
      }
      else{
        score+=0;
      }
      callWhiteList(ID1, ID2, score, total, officeID);
    });

  });


}

function callWhiteList(ID1,ID2, score, total, officeID){


  queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, ID1, function(err, data1) {

    queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, ID2, function(err, data2) {

      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)){
        score+=6
      }
      var pushing={emp1: ID1,
        emp2: ID2,
        score: score};
      pairScores.push(pushing);
      console.log("Length: "+pairScores.length);
      console.log("Total :"+total);
      if(pairScores.length === total){
        console.log("FINAL");
        console.log(pairScores);
        var fs=require('fs');
        fs.writeFile('seating_chart_algorithm/similarity_files/'+officeID+'_similarity.json', JSON.stringify(pairScores), function(err){
          if(err){
            console.log("Error writing JSON similarity_files");
            console.log(err);
          }
        })

        //write the file
      }

    });


  });


}



//queries.getAllEmployeesForOneOfficeConfidential(dbconnect, data[item].officeID, function(err, result) {
//});

//queries.getAllEmployeesForOneOffice(dbconnect, req.params.id, function(err, data) {
//});

//queries.getAllOffices(dbconnect, function(err, data) {
//});

var employeeSimilarity = new cronJob( '*/15 * * * *', function(){


  queries.getAllOffices(dbconnect, function(err, data) {
      var offices=data;
      offices.forEach(function(office, key){

        queries.getAllEmployeesForOneOfficeConfidential(dbconnect, office.officeID, function(err, data) {

          console.log("Office :"+office.officeID);

          emps = data;

          console.log("Length: "+emps.length)
          console.log("Total: "+((emps.length * (emps.length -1))/2));
          var total=((emps.length * (emps.length -1))/2);
          var good=false;

          var time=60*15*1000;
          console.log("Time: "+time);
          for (var i = 0; i < emps.length; i++ )
          {
            var temp=emps[i].accountUpdated;
            console.log(temp);
            console.log((new Date));
            var sqldate=new Date(temp);
            var result=((new Date) - sqldate);
            console.log(((new Date) - sqldate));
            console.log(time>result);
            if (result < time)
            {
              good=true;
            }
          }


          if(good){
            //var total=(emps.length * (emps.length -1))/2;


            emps.forEach(function(emp1, key){
              emps.forEach(function(emp2, key){
                if(emp1.employeeID===emp2.employeeID){

                }
                else{
                  var score=0;
                  var currentPair1='('+emp1.employeeID+','+emp2.employeeID+')';
                  var currentPair2='('+emp2.employeeID+','+emp1.employeeID+')';

                  if(pairs.indexOf(currentPair1) === -1 && pairs.indexOf(currentPair2) === -1){
                    pairs.push(currentPair1);
                    //
                    //Restroom usage
                    //
                    score+=10-Math.abs(emp1.restroomUsage-emp1.restroomUsage);

                    //
                    //Noise
                    //
                    score+=10-Math.abs(emp1.noisePreference-emp2.noisePreference);

                    //
                    //Out of Desk
                    //
                    score+=10-Math.abs(emp1.outOfDesk-emp2.outOfDesk);

                    callTeam(emp1.employeeID, emp2.employeeID, score, total, office.officeID);

                  }
                }
              });
            });
          }

        });
      });
    });



},  null, true);









// Export the app module
module.exports = app;
