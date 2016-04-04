var env = require('../../env');
var uuid = require('node-uuid');

exports.addRangeToEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_emp_temp SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was added to employee id %d", values[1], values[0]);
    }
  });
};

exports.deleteRangeToEmployee = function(connection, employeeID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE employeeID = ? AND rangeID = ?;", [employeeID, rangeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was deleted from employee ID %d", rangeID, employeeID);
    }
  });
};

exports.editRangeToEmployee = function(connection, values, employeeID) {
  connection.query("UPDATE seating_lucid_agency.has_a_emp_temp SET ? WHERE employeeID = ?", [values, employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was assigned to employee ID %d", values[1], values[0]);
    }
  });
};
