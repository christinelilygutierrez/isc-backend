var env = require('../../env');
var uuid = require('node-uuid');

/****Email Queries***/
exports.reminderUpdateEmail = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E WHERE E.haveUpdated <> '1';", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.quarterlyUpdateEmail = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E;", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.fiveDayOldAccounts = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E WHERE DATE(E.accountCreated) = DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND E.haveUpdated <> '1';", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.tenDayOrOlderAccounts = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E WHERE DATE(E.accountCreated) >= DATE_SUB(CURDATE(), INTERVAL 10 DAY) AND E.haveUpdated <> '1';", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.emailSuperAdmins = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E WHERE E.permissionLevel ='superadmin';", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
