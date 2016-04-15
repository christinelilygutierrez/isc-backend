var env = require('../env');
var cronJob = require('cron').CronJob;
var postmark = require("postmark");
var similarity = require('./../seating_chart_algorithm/similarity_algorithm');
var queries = require('../database/all_queries');
var dbconnect = queries.getConnection();

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return true;
};

exports.deletePasswordResetTokens = new cronJob( '00 12 * * *', function(){
  queries.deletePasswordResetTimeout(dbconnect);
}, null, true);

exports.dailyEmailJob = new cronJob( '38 22 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
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
          "From": "info@lucidseat.com",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to Lucid Seat now to update your profile!"
        });
      }
    }
  });
},  null, true);

exports.fiveDayEmailJob = new cronJob( '57 16 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
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
          "From": "info@lucidseat.com",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to Lucid Seat now to update your profile!"
        });
      }
    }
  });
},  null, true);

exports.tenDayEmailJob = new cronJob( '57 16 * * *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
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
          "From": "info@lucidseat.com",
          "To": val.email,
          "Subject": 'Please Update Your Preferences',
          "TextBody": "It looks like you still haven't updated your preferences!  Please login to Lucid Seat now to update your profile!"
        });
      }
    }
  });
},  null, true);

exports.quarterlyEmailJob = new cronJob( '30 03 01 */3 *', function(){
  // Require
  var postmark = require("postmark");

  // Example request
  var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
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
          "From": "info@lucidseat.com",
          "To": val.email,
          "Subject": "It's Been Awhile...",
          "TextBody": "Looks like you haven't updated your preferences in awhile!  If you need to update please login at Lucid Seat now!"
        });
      }
    }
  });
},  null, true);

exports.DailyUpdate= new cronJob( '00 11 * * *', function(){

  queries.getAllOffices(dbconnect, function(err, data) {
    for(var i in data){
      var officeID= data[i].officeID;
      queries.dailyUpdate(dbconnect, function(err, officeID, data){
        if(!isEmpty(data)){
          queries.emailOfficeAdmins(dbconnect, function(err, officeID, data) {
            if (err) {
              res.json(apiError.queryError("500", err.toString(), data));
            } else if (env.logQueries) {
              //console.log("The list of employees : ", data);
              email = data;
            } else {
              admin=JSON.parse(JSON.stringify(data));
              for (var i in admin) {
                val = admin[i];
                //console.log(val.email);
                client.sendEmail({
                  "From": "info@lucidseat.com",
                  "To": val.email,
                  "Subject": 'Seating Chart Update Recommended',
                  "TextBody": "Employee(s) have updated their preferences recently and the Seating Chart recommendation may have changed."
                });
              }
            }
          });
        }
      });
    }
  });
}, null, true);

exports.employeeSimilarity = new cronJob( '*/15 * * * *', function() {
  similarity.Start();
},  null, true);
