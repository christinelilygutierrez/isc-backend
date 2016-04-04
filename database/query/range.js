var env = require('../../env');
var uuid = require('node-uuid');

exports.addRange = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.range SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range between %f and %f was added to database", values[0], values[1]);
    }
  });
};

exports.deleteRange = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE rangeID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDrange = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.range WHERE rangeID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range %d was deleted from the database", id);
    }
  });
};

exports.editRange = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.range SET ? WHERE rangeID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range %d was edited in the database", id);
    }
  });
};

exports.getAllTempRanges = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.range;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneTempRange = function(connection, rangeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.range where rangeID = ?;', rangeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
