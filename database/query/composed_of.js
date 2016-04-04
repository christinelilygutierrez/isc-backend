var env = require('../../env');
var uuid = require('node-uuid');

exports.addDeskToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.composed_of SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.deleteDeskToCluster = function(connection, clusterID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofCluster = ? AND IDofDesk = ?;", [clusterID, deskID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was deleted from cluster ID %d", clusterID, deskID);
    }
  });
};

exports.editDeskToCluster = function(connection, values, clusterID, deskID) {
  connection.query("UPDATE seating_lucid_agency.composed_of SET ? WHERE IDofCluster = ? AND IDofDesk = ?;", [values, clusterID, deskID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};
