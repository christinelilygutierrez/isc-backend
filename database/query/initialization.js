var env = require('../../env');
var uuid = require('node-uuid');
var initialize_database_query = require('./initialize_database');

// Function that returns an object that represents a connection
exports.getConnection = function() {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.pass,
    database: env.database.name,
    multipleStatements: env.database.multipleStatements
  });
  return connection;
};

exports.getInitialConnection = function() {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.pass,
    multipleStatements: env.database.multipleStatements
  });
  return connection;
};

// Create database if it does not exist
exports.createDatabase = function(connection){
  connection.query(initialize_database_query.initializeQuery, function(err, rows){
    if (err && env.logErrors) {
      console.log(err);
    }
  });
};

// Check if database exists
exports.existsDatabase = function(connection, callback){
  connection.query("SELECT EXISTS (SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'seating_lucid_agency') AS result;", function(err, rows){
    if (err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.useDatabase = function(connection){
  connection.query("USE " +  env.database.name + ";", function(err, rows){
    if (err && env.logErrors) {
      console.log(err);
     } else {
     }
  });
};

// Initialization Queries
exports.existsCompany = function(connection, callback) {
  connection.query("SELECT EXISTS (SELECT companyID FROM seating_lucid_agency.company LIMIT 1) AS result;", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsCompanyForAdmin = function(connection, admin_ID, callback) {
  connection.query("SELECT EXISTS (SELECT admin_ID FROM seating_lucid_agency.manages WHERE admin_ID = ? LIMIT 1) AS result;", admin_ID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsEmployee = function(connection, employeeID, callback) {
  connection.query("SELECT EXISTS (SELECT employeeID FROM seating_lucid_agency.employee WHERE employeeID = ? LIMIT 1) AS result;", employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsEmployeeInOffice = function(connection, employeeID, callback) {
  connection.query("SELECT EXISTS (SELECT E.employeeID FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ? LIMIT 1) AS result;", employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsOffice = function(connection, callback) {
  connection.query("SELECT EXISTS (SELECT officeID FROM seating_lucid_agency.office LIMIT 1) AS result;", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsOfficeForAdmin = function(connection, admin_ID, callback) {
  connection.query("SELECT EXISTS (SELECT O.officeID FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E WHERE O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ? LIMIT 1) AS result;", admin_ID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsSuperadmin = function(connection, callback) {
  connection.query('SELECT EXISTS (SELECT A.employeeID FROM seating_lucid_agency.employee AS A WHERE A.permissionLevel = "superadmin") AS result;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsSuperadminWithOffice = function(connection, callback) {
  connection.query("SELECT EXISTS (SELECT O.officeID FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at as W WHERE E.permissionLevel = 'superadmin' AND E.employeeID = W.employeeKey AND W.officeKey = O.officeID) AS result;", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsTemperatureRange = function(connection, callback) {
  connection.query("SELECT EXISTS (SELECT rangeID FROM seating_lucid_agency.range LIMIT 1) AS result;", function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.existsTemperatureRangeForEmployee = function(connection, employeeID, callback) {
  connection.query("SELECT EXISTS (SELECT employeeID FROM has_a_emp_temp WHERE employeeID = ?) AS RESULT;", employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.verifyFloorPLanForEmployee = function(connection, employeeID, ID, callback) {
  connection.query('SELECT EXISTS (SELECT F.id FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E, seating_lucid_agency.floor_plans AS F WHERE F.office_id = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ? AND F.id = ? LIMIT 1) AS result;', [employeeID, ID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.verifyOfficeForEmployee = function(connection, employeeID, officeID, callback) {
  connection.query('SELECT EXISTS (SELECT O.officeID FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E WHERE O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ? AND O.officeID = ? LIMIT 1) AS result;', [employeeID, officeID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

exports.verifySeatingChartForEmployee = function(connection, employeeID, ID, callback) {
  connection.query('SELECT EXISTS (SELECT S.id FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E, seating_lucid_agency.seating_charts AS S WHERE S.office_id = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ? AND S.id = ? LIMIT 1) AS result;', [employeeID, ID], function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};
