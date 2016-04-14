var env = require('../../env');
var uuid = require('node-uuid');

// Non-Login Queries
exports.addCompany = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.company SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
      callback(err);
    } else if (env.logQueries) {
      console.log("Company added to database");
      callback(null);
    } else {
      callback(null);
    }
  });
};

exports.deleteCompany = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.manages WHERE company_ID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforCompany = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.company WHERE companyID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Company %d was deleted from database", id);
    }
  });
};

exports.editCompany = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.company SET ? WHERE companyID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Company %d edited in database", id);
    }
  });
};

exports.getAllCompanies = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.company;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneCompany = function(connection, companyID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.company WHERE companyID = ?;', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompaniesForAllOffices = function(connection, callback) {
  connection.query('SELECT C.companyID, C.companyName, O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompanyForOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT C.companyID, C.companyName, O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = ? AND O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompaniesForAdmin = function(connection, adminID, callback) {
  connection.query('SELECT C.companyID, C.companyName FROM seating_lucid_agency.company AS C, seating_lucid_agency.employee AS E, seating_lucid_agency.manages AS M WHERE C.companyID = M.company_ID AND M.admin_ID = E.employeeID AND (E.permissionLevel = "superadmin" OR E.permissionLevel = "admin") AND E.employeeID = ?', adminID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAdminsForCompany = function(connection, companyID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, E.lastName, E.email, E.department, E.title, E.pictureAddress FROM seating_lucid_agency.company AS C, seating_lucid_agency.employee AS E, seating_lucid_agency.manages AS M WHERE (E.permissionLevel = "superadmin" OR E.permissionLevel = "admin") AND C.companyID = M.company_ID AND M.admin_ID = E.employeeID AND C.companyID = ?;', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAdminsAndCompanies = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.manages', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompanyForAdmin = function(connection, adminID, callback) {
  connection.query('', adminID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneCompanyConfidential = function(connection,companyID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress, E.permissionLevel FROM seating_lucid_agency.employee AS E, seating_lucid_agency.company AS CO, seating_lucid_agency.office AS O, seating_lucid_agency.owned_by AS OW, seating_lucid_agency.works_at AS W WHERE CO.companyID = ? AND CO.companyID = OW.IDforCompany AND OW.IDforOffice = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneCompany = function(connection,companyID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.company AS CO, seating_lucid_agency.office AS O, seating_lucid_agency.owned_by AS OW, seating_lucid_agency.works_at AS W WHERE CO.companyID = ? AND CO.companyID = OW.IDforCompany AND OW.IDforOffice = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllOfficesForCompany = function(connection, callback) {
  connection.query('SELECT DISTINCT O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeStreetAddress, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllOfficesForOneCompany = function(connection, companyID, callback) {
  connection.query('SELECT DISTINCT O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeStreetAddress, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE C.companyID = ? AND O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllOfficesWithoutAnAdminForOneCompany = function(connection, companyID, callback) {
  connection.query('SELECT DISTINCT O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeStreetAddress, O.officeState, O.officeZipcode FROM seating_lucid_agency.company AS C, seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW WHERE C.companyID = ? AND C.companyID = OW.IDforCompany AND OW.IDforOffice = O.officeID AND (NOT O.officeID IN (SELECT W.officeKey FROM seating_lucid_agency.employee AS E, seating_lucid_agency.manages AS M, seating_lucid_agency.works_at AS W WHERE W.officeKey AND W.employeeKey = M.admin_ID AND M.admin_ID = E.employeeID AND E.permissionLevel = "admin"));', companyID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getLastCompany = function(connection, callback) {
  connection.query("SELECT C.companyID FROM seating_lucid_agency.company AS C WHERE C.companyID in (SELECT MAX(D.companyID) FROM seating_lucid_agency.company AS D);", function(err, result) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else if (env.logQueries) {
      console.log("%s %s was inserted into the database", values[0], values[1]);
      callback(null, result);
    } else {
      callback(null, result);
    }
  });
};
