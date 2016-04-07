var env = require('../../env');
var uuid = require('node-uuid');

exports.addEmployee = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.employee SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else if (env.logQueries) {
      console.log("%s %s was inserted into the database", values[0], values[1]);
      callback(null);
    } else {
      callback(null);
    }
  });
};

exports.addEmployeeSync = function(connection, values, officeID) {
  connection.query("INSERT INTO seating_lucid_agency.employee SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
    } else {
      connection.query("SELECT * FROM seating_lucid_agency.employee WHERE email = ?;", values.email, function(err, data) {
        if (err && env.logErrors) {
          console.log(err);
        } else if (env.logQueries) {
          console.log("%s %s was retrieved from database", values[0], values[1]);
        } else {
          connection.query("INSERT INTO seating_lucid_agency.works_at SET ?;", {employeeKey: data[0].employeeID, officeKey: officeID}, function(err, answer) {
            if (err && env.logErrors) {
              console.log(err);
            } else if (env.logQueries) {
              console.log("Inserted into Office");
            } else {
            }
          });
        }
      });
    }
  });
};

exports.addTeammate = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_teammates SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added as a teammate", values[0], values[1]);
    }
  });
};

exports.addToBlackList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_blacklist SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added to the black list", values[0], values[1]);
    }
  });
};

exports.addToWhiteList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_whitelist SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added to the white list", values[0], values[1]);
    }
  });
};

exports.deleteEmployee = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.password_reset WHERE employee_ID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.manages WHERE admin_ID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDemployee = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE employeeKey = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE employeeID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee WHERE employeeID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID % was deleted from the database", id);
    }
  });
};

exports.deleteTeammate = function(connection, employeeID, teammateID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [employeeID, teammateID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted as a teammate", employeeID, teammateID);
    }
  });
};

exports.deleteAllTeammatesForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted as a teammate", employeeID, teammateID);
    }
  });
};


exports.deleteEntireBlackListForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d deleted the entire black list", employeeID);
    }
  });
};

exports.deleteBlackList = function(connection, employeeID, blacklistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?;", [employeeID, blacklistEmployeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Entire blacklist deleted from employee %d", values[0], values[1]);
    }
  });
};

exports.deleteEntireWhiteListForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", [employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Entire whitelist deleted from employee %d", employeeID);
    }
  });
};

exports.deleteWhiteList = function(connection, employeeID, whitelistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [employeeID, whitelistEmployeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted from the white list", values[0], values[1]);
    }
  });
};

exports.editEmployee = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.employee SET ? WHERE employeeID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID % the database", id);
    }
  });
};

exports.editEmployeeUpdatedForOffice = function(connection, values, officeID) {
  connection.query("Update seating_lucid_agency.office SET ? WHERE officeID = ?;", [values, officeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee Updated for Office");
    }
  });
};

exports.editTeammate = function(connection, values, employeeID, teammateID) {
  connection.query("UPDATE seating_lucid_agency.employee_teammates SET ? WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [values, employeeID, teammateID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d changed as a teammate", values[0], values[1]);
    }
  });
};

exports.editBlackList = function(connection, values, employeeID, blacklistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_blacklist SET ? WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?", [values, employeeID, blacklistEmployeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d edited in the black list", values[0], values[1]);
    }
  });
};

exports.editWhiteList = function(connection, values, employeeID, whitelistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_whitelist SET ? WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [values, employeeID, whitelistEmployeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d edited in the white list", values[0], values[1]);
    }
  });
};

exports.getAllAdminEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.pictureAddress, E.permissionLevel FROM employee as E WHERE E.permissionLevel = "superadmin" OR E.permissionLevel = "admin";', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllBlacklistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllBlacklistEmployeesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = ? AND E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllBlacklistEmployeesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = ? AND E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployees = function(connection, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress FROM seating_lucid_agency.employee;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesConfidential = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInWhiteListOrBlackListConfidential = function(connection, employeeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress, E.permissionLevel FROM seating_lucid_agency.employee AS E WHERE E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [employeeID, employeeID, employeeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInWhiteListOrBlackList = function(connection, employeeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E WHERE E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [employeeID, employeeID, employeeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInWhiteListOrBlackListForOffice = function(connection, employeeID, officeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.works_at as WO, seating_lucid_agency.office as O WHERE E.employeeID = WO.employeeKey AND WO.officeKey = O.officeID AND O.officeID = ? AND E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [officeID, employeeID, employeeID, employeeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesExceptOne = function(connection, employeeID, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress  FROM seating_lucid_agency.employee WHERE employeeID <> ?', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneOfficeConfidential = function(connection, officeID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress, E.permissionLevel, E.accountUpdated FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress  FROM seating_lucid_agency.employee WHERE employeeID = ?', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee WHERE employeeID = ?;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getEmployeeUpdatedForOffice = function(connection, officeID, callback) {
  connection.query("SELECT employeeUpdated FROM seating_lucid_agency.office WHERE officeID = ?;", [officeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else if (env.logQueries) {
      console.log("Employee updated: %d", result[0].employeeUpdated);
      callback(null, result);
    } else {
      callback(null, result);
    }
  });
};

exports.getOfficeOfEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT O.officeID, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E WHERE O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ?;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammates = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', function(err, result) {
    if (err) {
      callback(err, null);
    }  else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammatesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName,  N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = ? AND E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammatesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName,  N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = ? AND E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInTeammatesForOffice = function(connection, employeeID, officeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.works_at as WO, seating_lucid_agency.office as O WHERE E.employeeID = WO.employeeKey AND WO.officeKey = O.officeID AND O.officeID = ? AND E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT T.employee_teammate_id FROM seating_lucid_agency.employee_teammates AS T WHERE T.idemployee_teammates = ?));', [officeID, employeeID, employeeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.has_a_emp_temp as H WHERE E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY E.employeeID ASC;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getTempRangeOfOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.has_a_emp_temp as H WHERE E.employeeID = ? AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY E.employeeID ASC;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployeesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = ? AND E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployeesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = ? AND E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getEmployeeProfileImage = function(connection, employeeID, callback) {
  connection.query('SELECT pictureAddress FROM seating_lucid_agency.employee WHERE employeeID = ?', [employeeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else if (env.logQueries) {
      console.log("Employee %d picture added", employeeID);
      callback(null, result);
    } else {
      callback(null, result);
    }
  });
};

exports.updateEmployeeProfileImage = function(connection, data) {
  connection.query('UPDATE seating_lucid_agency.employee SET pictureAddress = ? WHERE employeeID = ?', [data.pictureAddress, data.employeeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee %d picture added", data.employeeID);
    }
  });
};
