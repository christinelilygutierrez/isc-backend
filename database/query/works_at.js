var env = require('../../env');
var uuid = require('node-uuid');

exports.addEmployeeToOffice = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.works_at SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to office ID %d", values[0], values[1]);
    }
  });
};

exports.deleteEmployeeFromOffice = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE employeeKey = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was deleted from office ID %d", employeeID, officeID);
    }
  });
};

exports.deleteEmployeeWorksAt = function(connection, employeeID, officeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE employeeKey = ? AND officeKey = ? ;", [employeeID, officeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was deleted from office ID %d", employeeID, officeID);
    }
  });
};

exports.editEmployeeToOffice = function(connection, values, employeeID, officeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("UPDATE seating_lucid_agency.works_at SET ? WHERE employeeKey = ? AND officeKey = ?;", [values, employeeID, officeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to office ID %d", values[0], values[1]);
    }
  });
};
