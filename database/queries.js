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

//Bulk insert Queries

exports.bulkInsert=function(connection, values){
  connection.query("INSERT INTO seating_lucid_agency.bulktest VALUES ?",
   [values], function(err){
     if(err){
       //console.log("Error inserting data");
       console.log(err);
     }
     else{
       console.log("Inserted data");
     }
  });
};








// Login Queries
exports.getUser = function(connection, user, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ?", [user.email], function(err, rows){
    if(err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.getUserFromPassword = function(connection, user, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ? AND E.password = ?", [user.email, user.password], function(err, rows){
    if(err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

// exports.getUsers = function(connection, callback){
//   connection.query("SELECT * FROM employee;", function(err, rows){
//     if(err){
//       callback(err, null);
//     }
//     else{
//       callback(null, (rows));
//     }
//   });
// };





exports.validatedToken = function(connection, email, password, callback){
  connection.query("SELECT * FROM seating_lucid_agency.employee AS E WHERE E.email = ? AND E.password = ?;", [email, password], function(err, rows){
    if(err){
      callback(err, null);
    }
    else{
      callback(null, (rows));
    }
  });
};


// Non-Login Queries
exports.addCompany = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.company SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Company added to database");
    }
  });
};

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

exports.addEmployee = function(connection, values, callback) {
  connection.query("INSERT INTO seating_lucid_agency.employee SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else if (env.logQueries) {
      console.log("%s %s was inserted into the database", values[0], values[1]);
      callback(null);
    } else {
      callback(null);
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

exports.addEmployeeToOffice = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.works_at SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to office ID %d", values[0], values[1]);
    }
  });
};

exports.addFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.floor_plan SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan with height of %f and width of %f was added to database", values[0], values[1]);
    }
  });
};

exports.addFloorPlanToOffice = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.organized_by SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d added to office %d", values[1], values[0]);
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

exports.addOfficeToCompany = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.owned_by SET ?;", values, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office %d was added to company %d", values[0], values[1]);
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

exports.deleteCompany = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforCompany = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.company WHERE companyID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Company %d was deleted from database", id);
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
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE employeeKey = ?;", id, function(err, result) {
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

exports.deleteEmployeeFromOffice = function(connection, employeeID, officeID) {
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE employeeKey = ? AND officeKey = ? ;", [employeeID, officeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was deleted from office ID %d", employeeID, officeID);
    }
  });
};

exports.deleteFloorPlan = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.uses WHERE floorplanKey = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from uses", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE floorplanPkey = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from organized_by", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.floor_plan WHERE floor_planID = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d deleted from the database", id);
    }
  });
};

exports.deleteFloorPlanFromOffice = function(connection, floor_planID, officeID) {
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE floorplanPkey = ? AND officePkey = ? ;", [floor_planID, officeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan ID %d was deleted from office ID %d", floor_planID, officeID);
    }
  });
};

exports.deleteOffice = function(connection, id) {
  connection.query("DELETE FROM seating_lucid_agency.works_at WHERE officeKey = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from works_at", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE officePkey = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from organized by", id);
    }
  });
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforOffice = ?;", id, function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was deleted from owned_by", id);
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

exports.deleteOfficeFromCompany = function(connection, officeID, companyID) {
  connection.query("DELETE FROM seating_lucid_agency.owned_by WHERE IDforOffice = ? AND IDforCompany = ? ;", [officeID, companyID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("OfficeID %d was deleted from company ID %d", officeID, companyID);
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


exports.deleteEntireBlackListForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ?;", [employeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d deleted the entire black list", employeeID);
    }
  });
};

exports.deleteBlackList = function(connection, employeeID, blacklistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_blacklist WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?;", [employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Entire blacklist deleted from employee %d", values[0], values[1]);
    }
  });
};

exports.deleteEntireWhiteListForEmployee = function(connection, employeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ?;", [employeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Entire whitelist deleted from employee %d", employeeID);
    }
  });
};

exports.deleteWhiteList = function(connection, employeeID, whitelistEmployeeID) {
  connection.query("DELETE FROM seating_lucid_agency.employee_whitelist WHERE idemployee_whitelist = ? AND employee_whitelist_teammate_id = ?;", [employeeID, whitelistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d deleted from the white list", values[0], values[1]);
    }
  });
};

exports.editCompany = function(connection, values, id) {
  connection.query("UPDATE seating_lucid_agency.company SET ? WHERE companyID = ?;", [values, id], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Company %d edited in database", id);
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

exports.editEmployeeToOffice = function(connection, values, employeeID, officeID) {
  connection.query("UPDATE seating_lucid_agency.works_at SET ? WHERE employeeKey = ? AND officeKey = ?;", [values, employeeID, officeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d was assigned to office ID %d", values[0], values[1]);
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

exports.editFloorPlanToOffice = function(connection, values, floor_planID, officeID) {
  connection.query("UPDATE seating_lucid_agency.organized_by SET ? WHERE floorplanPkey = ? AND officePkey = ?;", [values, floor_planID, officeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan ID %d was assigned to office ID %d", values[0], values[1]);
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
};

exports.editOfficeToCompany = function(connection, values, officeID, companyID) {
  connection.query("UPDATE seating_lucid_agency.owned_by SET ? WHERE IDforOffice = ? AND IDforCompany = ?;", [values, officeID, companyID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Office ID %d was assigned to company ID %d", values[0], values[1]);
    }
  });
};

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

exports.editBlackList = function(connection, values, employeeID, blacklistEmployeeID) {
  connection.query("UPDATE seating_lucid_agency.employee_blacklist SET ? WHERE idemployee_blacklist = ? AND employee_blacklist_teammate_id = ?", [values, employeeID, blacklistEmployeeID], function(err, result) {
    if (err) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Employee ID %d had employee ID %d edited in the black list", values[0], values[1]);
    }
  });
};

exports.editWhiteList = function(connection, values, employeeID, whitelistEmployeeID) {
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

exports.getAllCompanies = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.company;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOneCompany = function(connection, companyID, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.company WHERE companyID = ?;', companyID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompaniesForAllOffices = function(connection, callback) {
  connection.query('SELECT C.companyName, O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getCompanyForOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT C.companyName, O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = ? AND O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', officeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllClusters = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster;', function(err, result) {
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

exports.getAllEmployeesNotInWhiteListOrBlackListConfidential = function(connection, employeeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress, E.permissionLevel FROM seating_lucid_agency.employee AS E WHERE E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [employeeID, employeeID, employeeID], function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInWhiteListOrBlackList = function(connection, employeeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E WHERE E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [employeeID, employeeID, employeeID], function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesNotInWhiteListOrBlackListForOffice = function(connection, employeeID, officeID, callback) {
    connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.works_at as WO, seating_lucid_agency.office as O WHERE E.employeeID = WO.employeeKey AND WO.officeKey = O.officeID AND O.officeID = ? AND E.employeeID  <>  ? AND NOT (E.employeeID in (SELECT W.employee_whitelist_teammate_id FROM seating_lucid_agency.employee_whitelist AS W WHERE W.idemployee_whitelist = ?)) AND NOT (E.employeeID in (SELECT B.employee_blacklist_teammate_id FROM seating_lucid_agency.employee_blacklist AS B WHERE B.idemployee_blacklist = ?));', [officeID, employeeID, employeeID, employeeID], function(err, result) {
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

exports.getAllEmployeesForOneCompanyConfidential = function(connection,companyID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress, E.permissionLevel FROM seating_lucid_agency.employee AS E, seating_lucid_agency.company AS CO, seating_lucid_agency.office AS O, seating_lucid_agency.owned_by AS OW, seating_lucid_agency.works_at AS W WHERE CO.companyID = ? AND CO.companyID = OW.IDforCompany AND OW.IDforOffice = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', companyID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneCompany = function(connection,companyID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.company AS CO, seating_lucid_agency.office AS O, seating_lucid_agency.owned_by AS OW, seating_lucid_agency.works_at AS W WHERE CO.companyID = ? AND CO.companyID = OW.IDforCompany AND OW.IDforOffice = O.officeID AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', companyID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneOfficeConfidential = function(connection, officeID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.password, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress, E.permissionLevel FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', officeID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllEmployeesForOneOffice = function(connection, officeID, callback) {
  connection.query('SELECT DISTINCT E.employeeID, E.firstName, E.lastName, E. email, E.department, E.title, E.restroomUsage, E.outOfDesk, E.pictureAddress FROM seating_lucid_agency.employee AS E, seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W WHERE O.officeID = ? AND O.officeID = W.officeKey AND W.employeeKey = E.employeeID;', officeID, function(err, result) {
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
  connection.query('SELECT F.floor_planID, F.height, F.width, F.numberOfDesks, F.matrix FROM seating_lucid_agency.floor_plan AS F, seating_lucid_agency.office AS O, seating_lucid_agency.organized_by AS OG WHERE F.floor_planID = OG.floorplanPkey AND OG.officePkey = O.officeID AND O.officeID = ?;', officeID, function(err, result) {
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

exports.getAllOfficesForCompany = function(connection, callback) {
  connection.query('SELECT DISTINCT O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeStreetAddress, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getAllOfficesForOneCompany = function(connection, companyID, callback) {
  connection.query('SELECT DISTINCT O.officeID, O.officeName, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeStreetAddress, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.owned_by OW, seating_lucid_agency.company AS C WHERE C.companyID = ? AND O.officeID = OW.IDforOffice AND OW.IDforCompany = C.companyID;', companyID, function(err, result) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

exports.getOfficeOfEmployee = function(connection, employeeID, callback) {
  connection.query('SELECT O.officeID, O.officePhoneNumber, O.officeEmail, O.officeStreetAddress, O.officeCity, O.officeState, O.officeZipcode FROM seating_lucid_agency.office AS O, seating_lucid_agency.works_at AS W, seating_lucid_agency.employee AS E WHERE O.officeID = W.officeKey AND W.employeeKey = E.employeeID AND E.employeeID = ?;', employeeID, function(err, result) {
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
