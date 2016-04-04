var env = require('../../env');
var uuid = require('node-uuid');

exports.addRangeToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_cluster_temp SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was added to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.deleteRangeToCluster = function(connection, clusterID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDcluster = ? AND IDrange = ?;", [clusterID, rangeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was deleted from cluster ID %d", rangeID, clusterID);
    }
  });
};

exports.editRangeToCluster = function(connection, values, clusterID) {
  connection.query("UPDATE seating_lucid_agency.has_a_cluster_temp SET ? WHERE IDcluster = ?;", [values, clusterID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};
