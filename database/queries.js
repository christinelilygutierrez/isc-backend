var env = require('../env');
var uuid = require('node-uuid');

// Function that returns an object that represents a connection
exports.getConnection = function() {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: env.database.host,
    user: env.database.user,
    password: env.database.pass,
    database: env.database.name
  });
  return connection;
};

// Login
exports.addUser=function(connection){
  // connection.query("select * from employees",  function(err, rows, fields){
  //   if(err) throw err;
  //   else console.log(rows);
  // });
};
exports.seedUsers=function(connection){
  // var a={
  //   'username': 'a',
  //   'password': 'pass',
  //   'uuid': uuid.v4()
  // };
  // var b={
  //   'username': 'b',
  //   'password': 'pass',
  //   'uuid': uuid.v4()
  // };
  // connection.query("insert into employees(uuid, username, password) values(?, ?, ?)", [
  //   a['uuid'],
  //   a['username'],
  //   a['password']
  // ]);
  // connection.query("insert into employees(uuid, username, password) values(?, ?, ?)", [
  //   b['uuid'],
  //   b['username'],
  //   b['password']
  // ]);
};

exports.getUser=function(connection, user, callback){
  connection.query("select * from employee where email = ?", [user.email], function(err,rows){
    if(err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.getUsers=function(connection, callback){
  connection.query("select * from employee;", function(err, rows){
    if(err){
      callback(err, null);
    }
    else{
      callback(null, (rows));
    }
  });
};

exports.saveUser=function(connection, user, callback){
  // var u= user.username;
  // var p= user.password;
  //   if(err){
  // connection.query("insert into employees(uuid, username, password) values(?, ?, ?)",[uuid.v4(), u, p],function(err){
  //     callback(err);
  //   }
  //   else{
  //     callback(null);
  //   }
  // });
};

// Other Queries
exports.addCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.cluster SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster at coordinate (%f, %f) added to database", values[0], values[1]);
    }
  });
};

exports.addClusterToFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.uses SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was added to floorplan ID %d", values[1], values[0]);
    }
  });
};

exports.addDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.desk SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk at coordinate (%f, %f) added to database", values[0], values[1]);
    }
  });
};

exports.addDeskToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.composed_of SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.addEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("%s %s was inserted into the database", values[0], values[1]);
    }
  });
};

exports.addEmployeeToDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.sits_at SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
    }
  });
};

exports.addFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.floor_plan SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor planw with height of %f and width of %f was added to database", values[0], values[1]);
    }
  });
};

exports.addOffice = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.office SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was added to database", values[0]);
    }
  });
};

exports.addRange = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.range SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range between %f and %f was added to database", values[0], values[1]);
    }
  });
};

exports.addRangeToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_cluster_temp SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was added to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.addRangeToEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_emp_temp SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was added to employee id %d", values[1], values[0]);
    }
  });
};

exports.addTeammate = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_teammates SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added as a teammate", values[0], values[1]);
    }
  });
};

exports.addToBlackList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_blacklist SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added to the black list", values[0], values[1]);
    }
  });
};

exports.addToWhiteList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_whitelist SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee id %d had employee id %d added to the white list", values[0], values[1]);
    }
  });
};

exports.deleteCluster = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE clusterKey= ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofCluster= ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDcluster= ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.cluster WHERE clusterID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster %d deleted from database", id);
    }
  });
};

exports.deleteClusterToFloorPlan = function(connection, floorplanID, clusterID) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE clusterKey = ? AND floorplanKey = ?;", [clusterID, floorplanID] , function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was deleted from floorplan ID %d", clusterID, floorplanID);
    }
  });
};

exports.deleteDesk = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofDesk = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDdesk = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.desk WHERE deskID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk %d deleted from database", id);
    }
  });
};

exports.deleteDeskToCluster = function(connection, clusterID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofCluster = ? AND IDofDesk = ?;", [clusterID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was deleted from cluster ID %d", clusterID, deskID);
    }
  });
};

exports.deleteEmployee = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDemployee = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE employeeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.employee WHERE employeeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID % was deleted from the database", id);
    }
  });
};

exports.deleteEmployeeToDesk = function(connection, employeeID, deskID) {
  connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDemployee = ? AND IDdesk = ?;", [employeeID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was deleted from desk ID %d", employeeID, deskID);
    }
  });
};

exports.deleteFloorPlan = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.range WHERE rangeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from the database", id);
    }
  });
};

exports.deleteOffice = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.floor_plan WHERE officeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan with Office ID %d was deleted from the database", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.office WHERE officeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was deleted from the database", id);
    }
  });
};

exports.deleteRange = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.range WHERE rangeID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range %d was deleted from the database", id);
    }
  });
};

exports.deleteRangeToCluster = function(connection, clusterID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_cluster_temp WHERE IDcluster = ? AND IDrange = ?;", [clusterID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was deleted from cluster ID %d", rangeID, clusterID);
    }
  });
};

exports.deleteRangeToEmployee = function(connection, employeeID, rangeID) {
  connection.query("DELETE FROM seating_lucid_agency.has_a_emp_temp WHERE employeeID = ? AND rangeID = ?;", [employeeID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was deleted from employee ID %d", rangeID, employeeID);
    }
  });
};

exports.deleteTeammate = function(connection, employeeID, teammateID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_teammates WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [employeeID, teammateID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted as a teammate", employeeID, teammateID);
    }
  });
};

exports.deleteToBlackList = function(connection, employeeID, blacklistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?;", [employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted from the black list", values[0], values[1]);
    }
  });
};

exports.deleteToWhiteList = function(connection, employeeID, whitelistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [employeeID, whitelistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted from the white list", values[0], values[1]);
    }
  });
};

exports.editCluster = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.cluster SET ? WHERE clusterID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster %d edited in database", id);
    }
  });
};

exports.editClusterToFloorPlan = function(connection, values, floorplanID, clusterID) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ? AND clusterKey = ?;", [values, floorplanID, clusterID] , function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Cluster ID %d was assigned to floorplan ID %d", values[0], values[1]);
    }
  });
};

exports.editDesk = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.desk SET ? WHERE deskID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk %d edited in database", id);
    }
  });
};

exports.editDeskToCluster = function(connection, values, clusterID, deskID) {
  connection.query("UPDATE seating_lucid_agency.composed_of SET ? WHERE IDofCluster = ? AND IDofDesk = ?;", [values, clusterID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.editEmployee = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.employee SET ? WHERE employeeID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID % the database", id);
    }
  });
};

exports.editEmployeeToDesk = function(connection, values, employeeID, deskID) {
  connection.query("UPDATE seating_lucid_agency.sits_at SET ? WHERE IDemployee = ? AND IDdesk = ?;", [values, employeeID, deskID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
    }
  });
};

exports.editFloorPlan = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.uses SET ? WHERE floorplanKey = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d edited in the database", id);
    }
  });
};

exports.editOffice = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.office SET ? WHERE officeID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was edited in the database", id);
    }
  });
}

exports.editRange = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.range SET ? WHERE rangeID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range %d was edited in the database", id);
    }
  });
};

exports.editRangeToCluster = function(connection, values, clusterID, rangeID) {
  connection.query("UPDATE seating_lucid_agency.has_a_cluster_temp SET ? WHERE IDcluster = ? AND IDrange = ?;", [values, clusterID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was assigned to cluster ID %d", values[1], values[0]);
    }
  });
};

exports.editRangeToEmployee = function(connection, values, employeeID, rangeID) {
  connection.query("UPDATE seating_lucid_agency.has_a_emp_temp SET ? WHERE employeeID = ? AND rangeID = ?;", [values, employeeID, rangeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Range ID %d was assigned to employee ID %d", values[1], values[0]);
    }
  });
};

exports.editTeammate = function(connection, values, employeeID, teammateID) {
  connection.query("UPDATE seating_lucid_agency.employee_teammates SET ? WHERE idemployee_teammates = ? AND employee_teammate_id = ?;", [values, employeeID, teammateID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d changed as a teammate", values[0], values[1]);
    }
  });
};

exports.editToBlackList = function(connection, values, employeeID, blacklistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_blacklist SET ? WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?", [values, employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d edited in the black list", values[0], values[1]);
    }
  });
};

exports.editToWhiteList = function(connection, values, employeeID, whitelistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_whitelist SET ? WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [values, employeeID, whitelistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d edited in the white list", values[0], values[1]);
    }
  });
};

exports.getAllBlacklistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllBlacklistEmployeesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = ? AND E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllBlacklistEmployeesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM employee as E, employee_blacklist as B, employee as N WHERE E.employeeID = ? AND E.employeeID = B.idemployee_blacklist AND E.employeeID != N.employeeID AND B.employee_blacklist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = B.employee_blacklist_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
}

exports.getAllClusters = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneCluster = function(connection, clusterID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster WHERE clusterID = ?', clusterID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllClustersOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, C.clusterID, C.xcoordinate, C.ycoordinate FROM seating_lucid_agency.floor_plan as F, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllClustersOfOneFloorplan = function(connection, floor_planID, callback) {
  connection.query('SELECT F.floor_planID, C.clusterID, C.xcoordinate, C.ycoordinate FROM seating_lucid_agency.floor_plan as F, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE F.floor_planID = ? AND F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID;', floor_planID,  function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllDesks = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.desk', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneDesk = function(connection, deskID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.desk WHERE deskID = ?', deskID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllDesksofClusters = function(connection, callback) {
  connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  })
};

exports.getAllDesksForOneCluster = function(connection, clusterID, callback) {
  connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = ? AND C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', clusterID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};


exports.getAllDesksWithEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, D.deskID FROM seating_lucid_agency.employee as E, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S WHERE E.employeeID = S.IDemployee AND S.IDdesk = D.deskID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getDeskOfEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT D.deskID, D.xcoordinate, D.ycoordinate, D.width, D.height FROM seating_lucid_agency.employee as E, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S WHERE E.employeeID = ? AND E.employeeID = S.IDemployee AND S.IDdesk = D.deskID;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    }
    else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployees = function(connection, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress FROM seating_lucid_agency.employee;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesConfidential = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesExceptOne = function(connection, employeeID, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress  FROM seating_lucid_agency.employee WHERE employeeID <> ?', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, E.lastName, E.email, E.department, E.title, E.restroomUsage, E.noisePreference, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.sits_at AS S, seating_lucid_agency.desk AS D, seating_lucid_agency.composed_of AS CO, seating_lucid_agency.cluster AS C, seating_lucid_agency.uses AS U, seating_lucid_agency.floor_plan AS F, seating_lucid_agency.office AS O WHERE  O.officeID = ? AND O.officeID = F.officeID AND F.floor_planID = U.floorplanKey AND U.clusterKey = C.clusterID AND C.clusterID = CO.IDofCluster AND CO.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID ORDER BY E.employeeID;', officeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT seating_lucid_agency.employee.employeeID, seating_lucid_agency.employee.firstName, seating_lucid_agency.employee.lastName, seating_lucid_agency.employee.email, seating_lucid_agency.employee.department, seating_lucid_agency.employee.title, seating_lucid_agency.employee.restroomUsage, seating_lucid_agency.employee.noisePreference, seating_lucid_agency.employee.outOfDesk, seating_lucid_agency.employee.pictureAddress  FROM seating_lucid_agency.employee WHERE employeeID = ?', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee WHERE employeeID = ?;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllFloorPlans = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.floor_plan;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneFloorPlan = function(connection, employeeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.floor_plan WHERE floor_planID = ?;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getFloorPlanOfOffice = function(connection, officeID, callback) {
  connection.query('SELECT F.floor_planID, F.height, F.width, F.numberOfDesks, F.matrix, F.officeID FROM seating_lucid_agency.floor_plan AS F, seating_lucid_agency.office AS O WHERE F.officeID = O.officeID AND O.officeID = ?;', officeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllOffices = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.office;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneOffice = function(connection, employeeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.office WHERE officeID = ?;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOfficeOfEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT O.officeID, O.companyName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.floor_plan AS F, seating_lucid_agency.uses AS U WHERE O.officeID = F.officeID AND F.floor_planID =  U.floorplanKey AND U.clusterKey in (SELECT C.clusterID FROM seating_lucid_agency.employee AS E, seating_lucid_agency.desk AS D, seating_lucid_agency.sits_at AS S, seating_lucid_agency.cluster AS C, seating_lucid_agency.composed_of AS K WHERE E.employeeID = ? AND E.employeeID = S.IDemployee AND S.IDdesk = D.deskID AND D.deskID = K.IDofDesk AND K.IDofCluster = C.clusterID);', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammates = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    }  else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammatesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName,  N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = ? AND E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTeammatesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName,  N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM  employee as E, employee_teammates as T, employee as N WHERE E.employeeID = ? AND E.employeeID = T.idemployee_teammates AND E.employeeID != N.employeeID AND T.employee_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = T.employee_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRanges = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.range;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneTempRange = function(connection, rangeID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.range where rangeID = ?;', rangeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfClusters = function(connection, callback) {
  connection.query('SELECT C.clusterID, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.cluster as C, seating_lucid_agency.range as R, seating_lucid_agency.has_a_cluster_temp as H WHERE C.clusterID = H.IDcluster AND H.IDrange = R.rangeID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getTempRangeOfOneCluster = function(connection, clusterID, callback) {
  connection.query('SELECT C.clusterID, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.cluster as C, seating_lucid_agency.range as R, seating_lucid_agency.has_a_cluster_temp as H WHERE C.clusterID = ? AND C.clusterID = H.IDcluster AND H.IDrange = R.rangeID;', clusterID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  })
};

exports.getAllTempRangesOfEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.has_a_emp_temp as H WHERE E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY E.employeeID ASC;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getTempRangeOfOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, R.rangeID, R.lower, R.upper FROM seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.has_a_emp_temp as H WHERE E.employeeID = ? AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY E.employeeID ASC;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfFloorplans = function(connection, callback) {
  connection.query('SELECT F.floor_planID, R.rangeID, R.lower, R.upper FROM  seating_lucid_agency.floor_plan as F, seating_lucid_agency.uses as U, seating_lucid_agency.cluster as C, seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S, seating_lucid_agency.composed_of as O, seating_lucid_agency.has_a_emp_temp H WHERE F.floor_planID = U.floorPlanKey AND U.clusterKey = C.clusterID AND C.clusterID = O.IDofCluster AND O.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY R.rangeID ASC;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllTempRangesOfOneFloorplan = function(connection, floor_planID, callback) {
  connection.query('SELECT F.floor_planID, R.rangeID, R.lower, R.upper FROM  seating_lucid_agency.floor_plan as F, seating_lucid_agency.uses as U, seating_lucid_agency.cluster as C, seating_lucid_agency.employee as E, seating_lucid_agency.range as R, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S, seating_lucid_agency.composed_of as O, seating_lucid_agency.has_a_emp_temp H WHERE F.floor_planID = ? AND F.floor_planID = U.floorPlanKey AND U.clusterKey = C.clusterID AND C.clusterID = O.IDofCluster AND O.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID AND E.employeeID = H.employeeID AND H.rangeID = R.rangeID GROUP BY R.rangeID ASC;', floor_planID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployees = function(connection, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployeesForOneEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = ? AND E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllWhitelistEmployeesForOneEmployeeConfidential = function(connection, employeeID, callback) {
  connection.query('SELECT E.employeeID, E.firstName, N.employeeID, N.firstName, N.lastName, N.email, N.password, N.department, N.title, N.restroomUsage, N.noisePreference, N.outOfDesk, N.pictureAddress, N.permissionLevel FROM employee as E, employee_whitelist as W, employee as N WHERE E.employeeID = ? AND E.employeeID = W.idemployee_whitelist AND E.employeeID != N.employeeID AND W.employee_whitelist_teammate_id in (SELECT employeeID FROM employee) AND N.employeeID = W.employee_whitelist_teammate_id;', employeeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.updateFloorplanNumberOfDesks = function(connection, floor_planID, callback) {
  connection.query('UPDATE `seating_lucid_agency`.`floor_plan` SET `numberOfDesks` = (SELECT COUNT(E.employeeID) FROM seating_lucid_agency.employee as E, seating_lucid_agency.sits_at as S, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as K, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE U.floorplanKey = ? AND  U.clusterKey = C.clusterID AND C.clusterID = K.IDofCluster AND K.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID ) WHERE `floor_planID` = ?;', [floor_planID, floor_planID], function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};
