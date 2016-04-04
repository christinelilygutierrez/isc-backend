var env = require('../../env');
var uuid = require('node-uuid');

exports.addClusterToFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.uses SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was added to floorplan ID %d", values[1], values[0]);
    }
  });
};

exports.deleteClusterToFloorPlan = function(connection, floorplanID, clusterID) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE clusterKey = ? AND floorplanKey = ?;", [clusterID, floorplanID] , function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was deleted from floorplan ID %d", clusterID, floorplanID);
    }
  });
};

exports.editClusterToFloorPlan = function(connection, values, floorplanID, clusterID) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ? AND clusterKey = ?;", [values, floorplanID, clusterID] , function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was assigned to floorplan ID %d", values[0], values[1]);
    }
  });
};
