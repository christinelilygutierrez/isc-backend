var env = require('../../env');
var uuid = require('node-uuid');

exports.addOfficeToCompany = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.owned_by SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was added to company %d", values[0], values[1]);
    }
  });
};

exports.deleteOfficeFromCompany = function(connection, officeID, companyID) {
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforOffice = ? AND IDforCompany = ? ;", [officeID, companyID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("OfficeID %d was deleted from company ID %d", officeID, companyID);
    }
  });
};

exports.editOfficeToCompany = function(connection, values, officeID, companyID) {
  connection.query("UPDATE seating_lucid_agency.owned_by SET ? WHERE IDforOffice = ? AND IDforCompany = ?;", [values, officeID, companyID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was assigned to company ID %d", values[0], values[1]);
    }
  });
};
