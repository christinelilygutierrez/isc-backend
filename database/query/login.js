var env = require('../../env');
var uuid = require('node-uuid');

// Login Queries
exports.getUser = function(connection, user, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ?", [user.email], function(err, rows){
    if (err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.getUserFromPassword = function(connection, user, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ? AND E.password = ?", [user.email, user.password], function(err, rows){
    if (err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.validatedToken = function(connection, email, password, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ? AND E.password = ?;", [email, password], function(err, rows){
    if (err){
      callback(err, null);
    } else {
      callback(null, (rows));
    }
  });
};

exports.validateUser = function(connection, email, password, employeeID, callback){
  connection.query("SELECT E.employeeID AS EID, E.permissionLevel AS EP, A.employeeID AS AID, A.permissionLevel AS AP FROM seating_lucid_agency.employee AS E, seating_lucid_agency.employee AS A WHERE E.email = ? AND E.password = ? AND A.employeeID = ?;", [email, password, employeeID], function(err, rows){
    if (err){
      callback(err, null);
    }
    else{
      callback(null, (rows));
    }
  });
};
