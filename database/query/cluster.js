var env = require('../../env');
var uuid = require('node-uuid');

exports.addCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.cluster SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster at coordinate (%f, %f) added to database", values[0], values[1]);
    }
  });
};

exports.deleteCluster = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE clusterKey= ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofCluster= ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDcluster= ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.cluster WHERE clusterID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster %d deleted from database", id);
    }
  });
};

exports.editCluster = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.cluster SET ? WHERE clusterID = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster %d edited in database", id);
    }
  });
};

exports.getAllClusters = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneCluster = function(connection, clusterID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster WHERE clusterID = ?', clusterID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllClustersOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, C.clusterID, C.xcoordinate, C.ycoordinate FROM seating_lucid_agency.floor_plan as F, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllClustersOfOneFloorplan = function(connection, floor_planID, callback) {
  connection.query('SELECT F.floor_planID, C.clusterID, C.xcoordinate, C.ycoordinate FROM seating_lucid_agency.floor_plan as F, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE F.floor_planID = ? AND F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID;', floor_planID,  function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllDesksofClusters = function(connection, callback) {
  connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllDesksForOneCluster = function(connection, clusterID, callback) {
  connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = ? AND C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', clusterID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
