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
exports.addSeatingChart = function(connection, newSeatingChart, callback) {
  connection.query('INSERT INTO ' + tableLoc + ' SET ?;', newSeatingChart, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Get the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - ID of office
 * @param {function} callback - The callback handler
 */
 exports.existsSeatingChartForOffice = function(connection, id, callback) {
   connection.query('SELECT EXISTS (SELECT S.id FROM seating_lucid_agency.seating_charts AS S WHERE S.office_id = ?) AS result;', id, function(err, result) {
     return err ? callback(err) : callback(null, result);
   });
 };

 /**
  * Get the collection
  *
  * @param {object} connection - The database connection object
  * @param {number} id - ID of office
  * @param {function} callback - The callback handler
  */
  exports.existsActiveSeatingChartForOffice = function(connection, id, callback) {
    connection.query('SELECT EXISTS (SELECT S.id FROM seating_lucid_agency.seating_charts AS S, seating_lucid_agency.is_active AS A WHERE A.id_seating_chart = S.id AND S.office_id = ?) AS result;', id, function(err, result) {
      return err ? callback(err) : callback(null, result);
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
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Get the collection
 *
 * @param {object} connection - The database connection object
 * @param {function} callback - The callback handler
 */
exports.getLatestSeatingChart = function(connection, callback) {
  connection.query('SELECT id FROM seating_lucid_agency.seating_charts WHERE id in (SELECT MAX(id) FROM seating_lucid_agency.seating_charts);', function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Get an item in the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to retrieve
 * @param {function} callback - The callback handler
 */
exports.getSeatingChart = function(connection, id, callback) {
  connection.query('SELECT * FROM ' + tableLoc + ' WHERE id = ?;', id, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Get an seating charts for an office
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to retrieve
 * @param {function} callback - The callback handler
 */
exports.getSeatingChartsOfOffice = function(connection, id, callback) {
  connection.query('SELECT S.id, S.name, S.base_floor_plan, S.base_floor_plan_rows, S.base_floor_plan_cols, S.base_floor_plan_name, S.seating_chart, S.office_id, S.created_at, S.updated_at FROM seating_lucid_agency.seating_charts AS S, seating_lucid_agency.office AS O WHERE S.office_id = O.officeID AND O.officeID = ?;', id, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Update an item in the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to update
 * @param {object} newSeatingChart - The updated item
 * @param {function} callback - The callback handler
 */
exports.updateSeatingChart = function(connection, id, newSeatingChart, callback) {
  connection.query('UPDATE ' + tableLoc + ' SET ? WHERE id = ?;', [newSeatingChart, id], function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Remove an item from the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to delete
 */
exports.removeSeatingChart = function(connection, id, callback) {
  connection.query("DELETE FROM seating_lucid_agency.is_active WHERE id_seating_chart = ?;", id, function(err, result) {
    if (err && env.logErrors) {
      console.log(err);
    } else if (env.logQueries) {
      console.log("Seating Chart ID %d was deleted from is_active", id);
    }
  });
  connection.query('DELETE FROM ' + tableLoc + ' WHERE id = ?;', id, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};
