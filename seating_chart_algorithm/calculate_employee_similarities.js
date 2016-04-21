var jsonfile = require('jsonfile');
var queries = require('../database/all_queries');
var connection = queries.getConnection();
var path = require('path');
var routes = require('../routes/index');
var _ = require('lodash');

/**
 * Calculate employee similarities
 *
 * @param {function} callback - The callback function
 */
exports.run = function calculateEmployeeSimilarities(officeId, callback) {
  var tmpDirPath = path.join(__dirname + '/tmp');
  var employeesFilePath = tmpDirPath + '/office-' + officeId + '-employees.json';
  var similaritiesFilePath = tmpDirPath + '/office-' + officeId + '-similarities.json';
  //
  // 1. Get office employees
  //
  queries.getAllEmployeesForOneOffice(connection, officeId, function(err, employees) {
    if (err) {
      console.log('queries.getAllEmployeesForOneOffice err', err);
      return callback(err, 'queries.getAllEmployeesForOneOffice');
    }
    console.log('queries.getAllEmployeesForOneOffice success');
    //
    // 2. Write employees to file
    //
    jsonfile.writeFile(employeesFilePath, employees, function(err) {
      if (err) {
        console.log('jsonfile.writeFile(employeesFilePath) err', err);
        return callback(err, 'jsonfile.writeFile(employeesFilePath)');
      }
      console.log('jsonfile.writeFile(employeesFilePath) success');
      //
      // 3. Get employee teammates
      //
      queries.getAllEmployeeRelations(connection, function(err, allEmployeeRelations) {
        if (err) {
          console.log('queries.getAllTeammates err', err);
          return callback(err, 'queries.getAllTeammates');
        }
        console.log('queries.getAllTeammates success');
        //
        // 4. Calculate employee similarities
        //
        var similarities = [];
        for (var i = 0; i < employees.length - 2; i++) {
          // get relations for employee "i"
          var employeeTeammates = _.filter(allEmployeeRelations.teammates, {
            idemployee_teammates: employees[i].employeeID
          });
          var employeeWhitelist = _.filter(allEmployeeRelations.whitelist, {
            idemployee_whitelist: employees[i].employeeID
          });
          var employeeBlacklist = _.filter(allEmployeeRelations.blacklist, {
            idemployee_blacklist: employees[i].employeeID
          });
          // loop through all other employees in the office
          //  NOTE: we only are visiting each pair once
          for (var j = i + 1; j < employees.length; j++) {
            // determine if there are any special relations
            //  between these two employees
            var isTeammate = _.some(employeeTeammates, {
              employee_teammate_id: employees[j].employeeID
            });
            var isWhitelist = _.some(employeeWhitelist, {
              employee_whitelist_teammate_id: employees[j].employeeID
            });
            var isBlacklist = _.some(employeeBlacklist, {
              employee_blacklist_teammate_id: employees[j].employeeID
            });
            similarities.push(similarityScore(employees[i], employees[j], isTeammate, isWhitelist, isBlacklist));
          }
        }
        //
        // 5. Write similarities to file
        //
        jsonfile.writeFile(similaritiesFilePath, similarities, function(err) {
          if (err) {
            console.log('jsonfile.writeFile(similaritiesFilePath) err', err);
            return callback(err, 'jsonfile.writeFile(similaritiesFilePath)');
          }
          console.log('jsonfile.writeFile(similaritiesFilePath) success');
          return callback(null, {
            employeesFilePath,
            similaritiesFilePath
          });
        });
      });
    });
  });
}

/**
 * Calculate similarity for two employees
 *
 * @param {object} a - The first employee
 * @param {object} a - The first employee
 * @param {boolean} isTeammate - Are the two employees teammates?
 * @param {boolean} isWhitelist - Are the two employees whitelisted?
 * @param {boolean} isBlacklist - Are the two employees blacklisted?
 * @return {number} - The score
 */
function similarityScore(a, b, isTeammate, isWhitelist, isBlacklist) {
  var similarity = 0;
  // compute preference similarity
  similarity += 10 - Math.abs(a.restroomUsage - b.restroomUsage);
  similarity += 10 - Math.abs(a.noisePreference - b.noisePreference);
  similarity += 10 - Math.abs(a.outOfDesk - b.outOfDesk);
  // factor in special relations
  if (isTeammate) {
    similarity += 7;
  }
  if (isWhitelist) {
    similarity += 6;
  }
  if (isBlacklist) {
    similarity -= 5;
  }
  // return the data structure that will be used directly by the Java program
  return {
    employeeId1: a.employeeID,
    employeeId2: b.employeeID,
    similarity
  };
}
