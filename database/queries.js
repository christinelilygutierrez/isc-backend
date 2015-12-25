// Function that returns an object that represents a connection
exports.getConnection = function(password) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: password,
    database:'seating_lucid_agency'
  });
  return connection;
};

exports.addCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.cluster (xcoordinate, ycoordinate) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster at coordinate (%f, %f) added to database", values[0], values[1]);
  });
};

exports.addClusterToFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.uses (floorplanKey, clusterKey) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster ID %d was added to floorplan ID %d", values[1], values[0]);
  });
};

exports.addDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.desk (xcoordinate, ycoordinate, width, height) VALUES (?, ?, ?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk at coordinate (%f, %f) added to database", values[0], values[1]);
  });
};

exports.addDeskToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.composed_of (IDofCluster, IDofDesk) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
  });
};

exports.addEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee (firstName, lastName, email, password, department, title, restroomUsage, noisePreference, outOfDesk, pictureAddress, permissionLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("%s %s was inserted into the database", values[0], values[1]);
  });
};

exports.addEmployeeToDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.sits_at (IDemployee, IDdesk) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
  });
};

exports.addFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.floor_plan (height, width) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Floor planw with height of %f and width of %f was added to database", values[0], values[1]);
  });
};

exports.addRange = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.range (lower, upper) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range between %f and %f was added to database", values[0], values[1]);
  });
};

exports.addRangeToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_cluster_temp (IDcluster, IDrange) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was added to cluster ID %d", values[1], values[0]);
  });
};

exports.addRangeToEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_emp_temp (employeeID, rangeID) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was added to employee id %d", values[1], values[0]);
  });
};

exports.addTeammate = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_teammates (idemployee_teammates, employee_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added as a teammate", values[0], values[1]);
  });
};

exports.addToBlackList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_blacklist (idemployee_blacklist, employee_blacklist_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added to the black list", values[0], values[1]);
  });
};

exports.addToWhiteList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_whitelist (idemployee_whitelist, employee_whitelist_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added to the white list", values[0], values[1]);
  });
};

exports.editCluster = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.cluster SET ? WHERE clusterID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster %d edited in database", id);
  });
};

exports.editClusterToFloorPlan = function(connection, values, floorplanID, clusterID) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ? AND clusterKey = ?;", [values, floorplanID, clusterID] , function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster ID %d was assigned to floorplan ID %d", values[0], values[1]);
  });
};

exports.editDesk = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.desk SET ? WHERE deskID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk %d edited in database", id);
  });
};

exports.editDeskToCluster = function(connection, values, clusterID, deskID) {
  connection.query("UPDATE seating_lucid_agency.composed_of SET ? WHERE IDofCluster = ? AND IDofDesk = ?;", [values, clusterID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
  });
};

exports.editEmployee = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.employee SET ? WHERE employeeID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID % the database", id);
  });
};

exports.editEmployeeToDesk = function(connection, values, employeeID, deskID) {
  connection.query("UPDATE seating_lucid_agency.sits_at SET ? WHERE IDemployee = ? AND IDdesk = ?;", [values, employeeID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
  });
};

exports.editFloorPlan = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Floor plan %d edited in the database", id);
  });
};

exports.editRange = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.range SET ? WHERE rangeID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range %d was edited in the database", id);
  });
};

exports.editRangeToCluster = function(connection, values, clusterID, rangeID) {
  connection.query("UPDATE seating_lucid_agency.has_a_cluster_temp SET ? WHERE IDcluster = ? AND IDrange = ?;", [values, clusterID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was assigned to cluster ID %d", values[1], values[0]);
  });
};

exports.editRangeToEmployee = function(connection, values, employeeID, rangeID) {
  connection.query("UPDATE seating_lucid_agency.has_a_emp_temp SET ? WHERE employeeID = ? AND rangeID = ?;", [values, employeeID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was assigned to employee ID %d", values[1], values[0]);
  });
};

exports.editTeammate = function(connection, values, employeeID, teammateID) {
  connection.query("UPDATE seating_lucid_agency.employee_teammates SET ? WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [values, employeeID, teammateID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d changed as a teammate", values[0], values[1]);
  });
};

exports.editToBlackList = function(connection, values, employeeID, blacklistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_blacklist SET ? WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?", [values, employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d edited in the black list", values[0], values[1]);
  });
};

exports.editToWhiteList = function(connection, values, employeeID, whitelistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_whitelist SET ? WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [values, employeeID, whitelistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d edited in the white list", values[0], values[1]);
  });
};

exports.deleteCluster = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.cluster WHERE clusterID = ?;",  id, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster %d deleted from database", id);
  });
};

exports.deleteClusterToFloorPlan = function(connection, floorplanID, clusterID) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE clusterKey = ? AND floorplanKey = ?;", [clusterID, floorplanID] , function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster ID %d was deleted from floorplan ID %d", clusterID, floorplanID);
  });
};

exports.deleteDesk = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.desk WHERE deskID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk %d deleted from database", id);
  });
};

exports.deleteDeskToCluster = function(connection, clusterID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofCluster = ? AND IDofDesk = ?;", [clusterID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk ID %d was deleted from cluster ID %d", clusterID, deskID);
  });
};

exports.deleteEmployee = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.employee WHERE employeeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID % was deleted from the database", id);
  });
};

exports.deleteEmployeeToDesk = function(connection, employeeID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDemployee = ? AND IDdesk = ?;", [employeeID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d was deleted from desk ID %d", employeeID, deskID);
  });
};

exports.deleteFloorPlan = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.range WHERE rangeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Floor plan %d deleted from the database", id);
  });
};

exports.deleteRange = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.range WHERE rangeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range %d was deleted from the database", id);
  });
};

exports.deleteRangeToCluster = function(connection, clusterID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDcluster = ? AND IDrange = ?;", [clusterID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was deleted from cluster ID %d", rangeID, clusterID);
  });
};

exports.deleteRangeToEmployee = function(connection, employeeID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE employeeID = ? AND rangeID = ?;", [employeeID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was deleted from employee ID %d", rangeID, employeeID);
  });
};

exports.deleteTeammate = function(connection, employeeID, teammateID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [employeeID, teammateID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d deleted as a teammate", employeeID, teammateID);
  });
};

exports.deleteToBlackList = function(connection, employeeID, blacklistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?;", [employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d deleted from the black list", values[0], values[1]);
  });
};

exports.deleteToWhiteList = function(connection, employeeID, whitelistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [employeeID, whitelistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d had employee ID %d deleted from the white list", values[0], values[1]);
  });
};

exports.getAllBlacklistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllClusters = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllClustersOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, C.clusterID, C.xcoordinate, C.ycoordinate FROM seating_lucid_agency.floor_plan as F, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllDesks = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.desk', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  });
};

exports.getAllDesksofClusters = function(connection, callback) {
  connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllDesksWithEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, D.deskID FROM seating_lucid_agency.employee as E, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S WHERE E.employeeID = S.IDemployee AND S.IDdesk = D.deskID;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllEmployees = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  });
};

exports.getAllTeammates = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllTempRangesOfClusters = function(connection, callback) {
  connection.query('SELECT C.clusterID, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.cluster as C, seating_lucid_agency.range as R, seating_lucid_agency.has_a_cluster_temp as H WHERE C.clusterID = H.IDcluster AND H.IDrange = R.rangeID;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllTempRangesOfEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, R.lower, R.upper FROM seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.has_a_emp_temp as H WHERE E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY E.employeeID ASC;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllTempRangesOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, R.rangeID, R.lower, R.upper FROM  seating_lucid_agency.floor_plan as F, seating_lucid_agency.uses as U, seating_lucid_agency.cluster as C, seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S, seating_lucid_agency.composed_of as O, seating_lucid_agency.has_a_emp_temp H WHERE F.floor_planID = U.floorPlanKey AND U.clusterKey = C.clusterID AND C.clusterID = O.IDofCluster AND O.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY R.rangeID ASC;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};

exports.getAllWhitelistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    }
    //callback(null, JSON.stringify(result));
    callback(null, result);
  })
};