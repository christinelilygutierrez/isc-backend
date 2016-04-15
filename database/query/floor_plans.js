var env = require('../../env');
var uuid = require('node-uuid');

/**
 * @var {string} - The database name to use (we should really move this to ./env.js)
 */
const dbName = 'seating_lucid_agency';

/**
 * @var {string} - The table name
 */
const tableName = 'floor_plans';

/**
 * @var {string} - The table location
 */
const tableLoc = dbName + '.' + tableName;

/**
 * Add an item to the collection
 *
 * @param {object} connection - The database connection object
 * @param {object} newFloorPlan - The new item to create
 */
exports.addFloorPlan = function(connection, newFloorPlan, callback) {
  connection.query('INSERT INTO ' + tableLoc + ' SET ?;', newFloorPlan, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Get the collection
 *
 * @param {object} connection - The database connection object
 * @param {function} callback - The callback handler
 */
exports.getFloorPlans = function(connection, callback) {
  connection.query('SELECT * FROM ' + tableLoc, function(err, result) {
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
exports.getFloorPlan = function(connection, id, callback) {
  connection.query('SELECT * FROM ' + tableLoc + ' WHERE id = ?;', id, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Update an item in the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to update
 * @param {object} newFloorPlan - The updated item
 * @param {function} callback - The callback handler
 */
exports.updateFloorPlan = function(connection, id, newFloorPlan, callback) {
  connection.query('UPDATE ' + tableLoc + ' SET ? WHERE id = ?;', [newFloorPlan, id], function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};

/**
 * Remove an item from the collection
 *
 * @param {object} connection - The database connection object
 * @param {number} id - The id of the item to delete
 */
exports.removeFloorPlan = function(connection, id, callback) {
  connection.query('DELETE FROM ' + tableLoc + ' WHERE id = ?;', id, function(err, result) {
    return err ? callback(err) : callback(null, result);
  });
};
