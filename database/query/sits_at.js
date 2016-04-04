var env = require('../../env');
var uuid = require('node-uuid');

exports.addEmployeeToDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.sits_at SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
    }
  });
};

exports.deleteEmployeeToDesk = function(connection, employeeID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDemployee = ? AND IDdesk = ?;", [employeeID, deskID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was deleted from desk ID %d", employeeID, deskID);
    }
  });
};

exports.editEmployeeToDesk = function(connection, values, employeeID, deskID) {
  connection.query("UPDATE seating_lucid_agency.sits_at SET ? WHERE IDemployee = ? AND IDdesk = ?;", [values, employeeID, deskID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
    }
  });
};
