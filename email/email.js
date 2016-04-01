var cronJob = require('cron').CronJob;
var postmark = require("postmark");

exports.emailJobs = function() {
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
          //console.log(val.email);
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": 'Please Update Your Preferences',
            "TextBody": "It looks like you still haven't updated your preferences! Please login to DeskSeeker now to update your profile!"
          });
        }
      }
    });
  },  null, true);
  var fiveDayEmailJob = new cronJob( '57 16 * * *', function() {
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
          //console.log(val.email);
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": 'Please Update Your Preferences',
            "TextBody": "It looks like you still haven't updated your preferences!  Please login to DeskSeeker now to update your profile!"
          });
        }
      }
    });
  }, null, true);
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
          //console.log(val.email);
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
          //console.log(val.email);
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": "It's Been Awhile...",
            "TextBody": "Looks like you haven't updated your preferences in awhile!  If you need to update please login at DeskSeeker now!"
          });
        }
      }
    });
  }, null, true);
};
