var env = require('../../env');
var uuid = require('node-uuid');

/**
 * @var {string} - The database name to use (we should really move this to ./env.js)
 */
const dbName = 'seating_lucid_agency';

/**
 * @var {string} - The table name
 */
const tableName = 'is_active';

/**
 * @var {string} - The full table name
 */
const fullTableName = dbName + '.' + tableName;

/**
* @param {object} connection - The MySQL connection to the database
* @param {object} values - The object to be added to the database
* @param {function} callback - Returns the results asynchronously
*/
exports.addActiveSeatingChartToOffice = function(connection, values, callback) {
  connection.query('INSERT INTO ' + fullTableName +  ' SET ?;', values, function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {number} id - The id of the office to change the active seating chart
* @param {function} callback - Returns the results asynchronously
*/
exports.deleteActiveSeatingChartFromOffice = function(connection, id, callback) {
  connection.query('DELETE FROM' + fullTableName +  '  WHERE id_office = ?;', id, function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {number} id - The id of the  seating chart to change the office
* @param {function} callback - Returns the results asynchronously
*/
exports.deleteOfficeFromActiveSeatingChart = function(connection, id, callback) {
  connection.query('DELETE FROM' + fullTableName +  '  WHERE id_seating_chart = ?;', id, function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {object} values - The object to be added to the database
* @param {number} id - The id of the office to change the active seating chart
* @param {function} callback - Returns the results asynchronously
*/
exports.editActiveSeatingChartToOffice = function(connection, values, id, callback) {
  connection.query('UPDATE ' + fullTableName +  ' SET ? WHERE id_office = ?;', [values, id], function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {number} id - The id of the office to change the active seating chart
* @param {function} callback - Returns the results asynchronously
*/
exports.getActiveSeatingChartOfOffice = function(connection, id, callback) {
  connection.query('SELECT * FROM ' + fullTableName +  ' WHERE id_office = ?;', id, function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {number} id - The id of the office to change the active seating chart
* @param {function} callback - Returns the results asynchronously
*/
exports.getOfficeOfActiveSeatingChart = function(connection, id, callback) {
  connection.query('SELECT * FROM ' + fullTableName +  ' WHERE id_seating_chart = ?;', id, function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};

/**
* @param {object} connection - The MySQL connection to the database
* @param {number} id_office - The id of the office
* @param {number} id_seating_chart - The id of the active seating chart
* @param {function} callback - Returns the results asynchronously
*/
exports.getIsActive = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.is_active;', function(err, result) {
      return err ? callback(err) : callback(null, result);
  });
};
