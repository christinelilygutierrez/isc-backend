var env = require('../../env');
var uuid = require('node-uuid');

exports.addFloorPlanToOffice = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.organized_by SET ?;", values, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan %d added to office %d", values[1], values[0]);
    }
  });
};

exports.deleteFloorPlanFromOffice = function(connection, floor_planID, officeID) {
  connection.query("DELETE FROM seating_lucid_agency.organized_by WHERE floorplanPkey = ? AND officePkey = ? ;", [floor_planID, officeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan ID %d was deleted from office ID %d", floor_planID, officeID);
    }
  });
};

exports.editFloorPlanToOffice = function(connection, values, floor_planID, officeID) {
  connection.query("UPDATE seating_lucid_agency.organized_by SET ? WHERE floorplanPkey = ? AND officePkey = ?;", [values, floor_planID, officeID], function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Floor plan ID %d was assigned to office ID %d", values[0], values[1]);
    }
  });
};
