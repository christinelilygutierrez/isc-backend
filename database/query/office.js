var env = require('../../env');
var uuid = require('node-uuid');

exports.addOffice = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.office SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
      callback(null);
    } else if (env.logQueries) {
      console.log("Office %d was added to database", values[0]);
      callback(null);
    } else {
      callback(null);
    }
  });
};

exports.deleteOffice = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE officeKey = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from works_at", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE officePkey = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from organized by", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforOffice = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from owned_by", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.office WHERE officeID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was deleted from the database", id);
    }
  });
};

exports.editOffice = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.office SET ? WHERE officeID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was edited in the database", id);
    }
  });
};

exports.getAllOffices = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.office;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.office WHERE officeID = ?;', officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getMostRecentOffice = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.office WHERE seating_lucid_agency.office.officeID in (SELECT MAX(seating_lucid_agency.office.officeID) FROM seating_lucid_agency.office);', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
