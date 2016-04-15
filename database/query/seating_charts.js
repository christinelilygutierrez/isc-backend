var env = require('../../env');
var uuid = require('node-uuid');

/**
 * @var {string} - The database name to use (we should really move this to ./env.js)
 */
const dbName = 'seating_lucid_agency';

/**
 * @var {string} - The table name
 */
const tableName = 'seating_charts';

/**
 * @var {string} - The table location
 */
const tableLoc = dbName + '.' + tableName;

/**
 * Add an item to the collection
 *
 * @param {object} connection - The database connection object
 * @param {object} newSeatingChart - The new item to create
 */
exports.addSeatingChart = function(connection, newSeatingChart) {
  connection.query('INSERT INTO ' + tableLoc + ' SET ?;', newSeatingChart, function(err, result) {
    if (err && env.logErrors) {
      return console.log(err);
    }
    if (env.logQueries) {
      return console.log('New seating chart created', newSeatingChart);
    }
  });
};

/**
 * Get the collection
 *
 * @param {object} connection - The database connection object
 * @param {function} callback - The callback handler
 */
exports.getSeatingCharts = function(connection, callback) {
  connection.query('SELECT * FROM ' + tableLoc, function(err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, (result));
    }
  });
};

//
// exports.deleteDesk = function(connection, id) {
//   connection.query("DELETE FROM seating_lucid_agency.composed_of WHERE IDofDesk = ?;", id, function(err, result) {
//     if (err && env.logErrors) {
//       console.log(err);
//     }
//   });
//   connection.query("DELETE FROM seating_lucid_agency.sits_at WHERE IDdesk = ?;", id, function(err, result) {
//     if (err && env.logErrors) {
//       console.log(err);
//     }
//   });
//   connection.query("DELETE FROM seating_lucid_agency.desk WHERE deskID = ?;", id, function(err, result) {
//     if (err && env.logErrors) {
//       console.log(err);
//     } else if (env.logQueries) {
//       console.log("Desk %d deleted from database", id);
//     }
//   });
// };
//
// exports.editDesk = function(connection, values, id) {
//   connection.query("UPDATE seating_lucid_agency.desk SET ? WHERE deskID = ?;", [values, id], function(err, result) {
//     if (err && env.logErrors) {
//       console.log(err);
//     } else if (env.logQueries) {
//       console.log("Desk %d edited in database", id);
//     }
//   });
// };

// exports.getOneDesk = function(connection, deskID, callback) {
//   connection.query('SELECT * FROM seating_lucid_agency.desk WHERE deskID = ?', deskID, function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
//
// exports.getAllDesksofClusters = function(connection, callback) {
//   connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
//
// exports.getAllDesksForOneCluster = function(connection, clusterID, callback) {
//   connection.query('SELECT C.clusterID, D.deskID, D.xcoordinate, D.ycoordinate FROM seating_lucid_agency.cluster as C, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as Z WHERE C.clusterID = ? AND C.clusterID = Z.IDofCluster AND Z.IDofDesk = D.deskID;', clusterID, function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
//
// exports.getAllDesksWithEmployees = function(connection, callback) {
//   connection.query('SELECT E.employeeID, E.firstName, D.deskID FROM seating_lucid_agency.employee as E, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S WHERE E.employeeID = S.IDemployee AND S.IDdesk = D.deskID;', function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
//
// exports.getDeskOfEmployee = function(connection, employeeID, callback) {
//   connection.query('SELECT D.deskID, D.xcoordinate, D.ycoordinate, D.width, D.height FROM seating_lucid_agency.employee as E, seating_lucid_agency.desk as D, seating_lucid_agency.sits_at as S WHERE E.employeeID = ? AND E.employeeID = S.IDemployee AND S.IDdesk = D.deskID;', employeeID, function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
//
// exports.updateFloorplanNumberOfDesks = function(connection, floor_planID, callback) {
//   connection.query('UPDATE seating_lucid_agency.floor_plan SET numberOfDesks = (SELECT COUNT(E.employeeID) FROM seating_lucid_agency.employee as E, seating_lucid_agency.sits_at as S, seating_lucid_agency.desk as D, seating_lucid_agency.composed_of as K, seating_lucid_agency.cluster as C, seating_lucid_agency.uses as U WHERE U.floorplanKey = ? AND  U.clusterKey = C.clusterID AND C.clusterID = K.IDofCluster AND K.IDofDesk = D.deskID AND D.deskID = S.IDdesk AND S.IDemployee = E.employeeID ) WHERE floor_planID = ?;', [floor_planID, floor_planID], function(err, result) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, (result));
//     }
//   });
// };
