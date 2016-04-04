var env = require('../../env');
var uuid = require('node-uuid');

exports.addPasswordReset = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.password_reset SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else if (env.logQueries) {
      console.log("Temporary password added to the database");
      callback(null);
    } else {
      callback(null);
    }
  });
};

exports.deletePasswordReset = function(connection, resetID) {
  connection.query("DELETE FROM seating_lucid_agency.password_reset WHERE reset_ID=?;", resetID, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Temporary password deleted for %d", resetID);
    }
  });
};

exports.deletePasswordResetTimeout = function(connection) {
  connection.query("DELETE FROM seating_lucid_agency.password_reset WHERE time_created < (NOW() - INTERVAL 20 MINUTE);", function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Temporary passwords deleted that were older than 20 minutes.");
    }
  });
};

exports.deletePasswordResetForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.password_reset WHERE employee_ID;", employeeID, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Temporary password deleted for %d", employeeID);
    }
  });
};

exports.editPasswordReset = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.password_reset SET ? WHERE reset_ID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Temporary password %d was edited in the database", id);
    }
  });
};

exports.editPasswordResetForEmployee = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.password_reset SET ? WHERE employee_ID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Temporary password for employee %d was edited in the database", id);
    }
  });
};

exports.getPasswordReset = function(connection, token, callback) {
  connection.query('SELECT R.reset_ID, R.token, R.time_created, R.employee_ID FROM seating_lucid_agency.password_reset as R WHERE R.token=? AND R.time_created > (NOW() - INTERVAL 20 MINUTE);', [token], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getPasswordResetForEmployee = function(connection, id, callback) {
  connection.query('SELECT R.reset_ID, R.token, R.time_created, R.employee_ID, E.email FROM seating_lucid_agency.password_reset as R, seating_lucid_agency.employee AS E WHERE E.employeeID = R.employee_ID AND R.employee_ID = ?;', [id], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
