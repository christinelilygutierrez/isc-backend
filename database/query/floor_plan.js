var env = require('../../env');
var uuid = require('node-uuid');

exports.addFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.floor_plan SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan with height of %f and width of %f was added to database", values[0], values[1]);
    }
  });
};

exports.deleteFloorPlan = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE floorplanKey = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from uses", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE floorplanPkey = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from organized_by", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.floor_plan WHERE floor_planID = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from the database", id);
    }
  });
};

exports.editFloorPlan = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ?;", [values, id], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d edited in the database", id);
    }
  });
};

exports.getAllFloorPlans = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.floor_plan;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneFloorPlan = function(connection, employeeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.floor_plan WHERE floor_planID = ?;', employeeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getFloorPlanOfOffice = function(connection, officeID, callback) {
  connection.query('SELECT F.floor_planID, F.height, F.width, F.numberOfDesks, F.matrix FROM seating_lucid_agency.floor_plan AS F, seating_lucid_agency.office AS O, seating_lucid_agency.organized_by AS OG WHERE F.floor_planID = OG.floorplanPkey AND OG.officePkey = O.officeID AND O.officeID = ?;', officeID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, R.rangeID, R.lower, R.upper FROM  seating_lucid_agency.floor_plan as F, seating_lucid_agency.uses as U, seating_lucid_agency.cluster as C, seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S, seating_lucid_agency.composed_of as O, seating_lucid_agency.has_a_emp_temp H WHERE F.floor_planID = U.floorPlanKey AND U.clusterKey = C.clusterID AND C.clusterID = O.IDofCluster AND O.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY R.rangeID ASC;', function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfOneFloorplan = function(connection, floor_planID, callback) {
  connection.query('SELECT F.floor_planID, R.rangeID, R.lower, R.upper FROM  seating_lucid_agency.floor_plan as F, seating_lucid_agency.uses as U, seating_lucid_agency.cluster as C, seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S, seating_lucid_agency.composed_of as O, seating_lucid_agency.has_a_emp_temp H WHERE F.floor_planID = ? AND F.floor_planID = U.floorPlanKey AND U.clusterKey = C.clusterID AND C.clusterID = O.IDofCluster AND O.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY R.rangeID ASC;', floor_planID, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
