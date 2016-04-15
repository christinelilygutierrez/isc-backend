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
exports.dailyUpdate = function(connection, officeID, callback) {
  connection.query("SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.accountUpdated < (NOW() - INTERVAL 1 DAY);", officeID, function(err, result){
    if(err){
      callback(err, null);
    } else{
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

exports.emailAdmins = function(connection, callback) {
  connection.query("SELECT E.email FROM seating_lucid_agency.employee AS E WHERE E.permissionLevel ='admin';", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.emailOfficeAdmins = function(connection, officeID, callback) {
  connection.query("SELECT DISTINCT E.email FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND WHERE E.permissionLevel ='admin';", officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
