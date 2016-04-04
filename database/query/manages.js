var env = require('../../env');
var uuid = require('node-uuid');

function getCompanyIDs(connection, callback) {
  connection.query("SELECT companyID FROM seating_lucid_agency.company;", function(err, result) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

function getSuperadminIDs(connection, callback) {
  connection.query('SELECT E.employeeID FROM seating_lucid_agency.employee AS E WHERE E.permissionLevel = "superadmin";', function(err, result) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.addAdminToCompany = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.manages SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else if (env.logQueries) {
      console.log("Admin was added to company");
      callback(null);
    } else {
      callback(null);
    }
  });
};

exports.addSuperadminToAllCompanies = function(connection, admin_ID) {
  getCompanyIDs(connection, function(err, results) {
    for (var item in results) {
      //console.log(results[item]);
      connection.query("INSERT INTO seating_lucid_agency.manages SET ?;", {admin_ID: admin_ID, company_ID: results[item].companyID } , function(err, exe) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });
};

exports.addAllSuperadminToCompany = function(connection, company_ID) {
  getSuperadminIDs(connection, function(err, results) {
    for (var item in results) {
      console.log(results[item]);
      connection.query("INSERT INTO seating_lucid_agency.manages SET ?;", {admin_ID: results[item].employeeID, company_ID: company_ID } , function(err, exe) {
        if (err) {
          console.log(err);
        } else {
        }
      });
    }
  });
};

exports.deleteAdminToCompany = function(connection, adminID, companyID) {
  connection.query("DELETE FROM seating_lucid_agency.manages WHERE admin_ID = ? AND company_ID;", [adminID, companyID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Admin deleted from company");
    }
  });
};

exports.editAdminToCompany = function(connection, values, adminID, companyID) {
  connection.query("UPDATE seating_lucid_agency.manages SET ? WHERE admin_ID = ? AND company_ID;", [values, adminID, companyID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Admin was changed to a new company");
    }
  });
};
