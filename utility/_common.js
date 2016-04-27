var apiError = require('../database/api_responses/api_errors');
var apiSuccess = require('../database/api_responses/api_successes');
var bcrypt = require('bcrypt');
var csvParser = require('csv-parse');
var env = require('../env');
var exec = require('child_process').exec;
var express = require('express');
var fs = require('fs');
var jsonfile = require('jsonfile');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var path = require('path');
var postmark = require("postmark");
var queries = require('../database/all_queries');
var router = express.Router();
var uuid = require('node-uuid');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var _ = require('lodash');

exports.isInt = function(value) {
  return !isNaN(value) &&  parseInt(Number(value)) == value &&   !isNaN(parseInt(value, 10));
};

exports.isEmpty = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
};

exports.employeePropertiesToArray = function(employee) {
  return Object.keys(employee).map(function(k) {
    return employee[k];
  });
};

exports.superadminPermissionCheck = function(token, callback) {
  if (token) {
    //console.log('hi');
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        //console.log('there');
        callback(apiError.successError(false, 'Token authentication failure'));
      } else {
        //console.log('decoded: ', decoded);
         queries.validatedToken(dbconnect, decoded.email, decoded.password, function(err, results) {
           if (err) {
            callback(apiError.successError(false, 'Token could not be associated with a valid employee'));
           } else {
             if (results[0].permissionLevel != 'superadmin') {
               callback(apiError.successError(false, 'Permission Denied. superadmin access only'));
             } else {
               callback(apiError.successError(true, 'superadmin verified'));
             }
           }
         });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};

exports.superadminDeletePermissionCheck = function(token, employeeID, callback) {
  if (token) {
    //console.log('hi');
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        //console.log('there');
        callback(apiError.successError(false, 'Token authentication failure'));
      } else {
        //console.log('decoded: ', decoded);
        queries.validateUser(dbconnect, decoded.email, decoded.password, employeeID, function(err, results) {
          if (err) {
           callback(apiError.successError(false, 'superadminDeletePermissionCheck failed'));
         } else {
           if (isEmpty(results)) {
             callback(apiError.successError(false, 'Error: invalid parameters'));
           } else {
             employee1 = {employeeID : results[0].EID, permissionLevel: results[0].EP};
             employee2 = {employeeID : results[0].AID, permissionLevel: results[0].AP};
             if (employee1.permissionLevel == 'user') {
               callback(apiError.successError(false, 'Permission denied. Must be superadmin'));
             } else if (employee1.permissionLevel == 'admin') {
               callback(apiError.successError(false, 'Permission denied. must be superadmin'));
             } else if (employee1.permissionLevel == 'superadmin' && employee2.permissionLevel == 'superadmin' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. superadmins cannot delete other superadmins'));
             } else if (employee1.permissionLevel == 'superadmin'){
               queries.isEmployeeLastSuperadmin(dbconnect, employee2.employeeID, function(err, data) {
                 if (err) {
                   callback(apiError.successError(false, 'superadminDeletePermissionCheck query failure with last superadmin'));
                 } else {
                   if (data[0].result == 0) {
                     callback(apiError.successError(false, 'Last superadmin in system cannot be deleted'));
                   } else {
                     callback(apiError.successError(true, 'superadmin delete access granted'));
                   }
                 }
               });
             } else {
               callback(apiError.successError(false, 'Permission denied. Invalid permission level'));
             }
           }
         }
        });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};

exports.adminPermissionCheck = function(token, callback) {
  if (token) {
    //console.log('hi');
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        //console.log('there');
        callback(apiError.successError(false, 'Token authentication failure'));
      } else {
        //console.log('decoded: ', decoded);
         queries.validatedToken(dbconnect, decoded.email, decoded.password, function(err, results) {
           if (err) {
            callback(apiError.successError(false, 'adminPermissionCheck failed'));
          } else {
            if (results[0].permissionLevel != 'admin' && results[0].permissionLevel != 'superadmin') {
              callback(apiError.successError(false, 'Permission Denied. admin required'));
            } else {
              callback(apiError.successError(true, 'admin verified'));
            }
          }
        });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};

exports.adminDeletePermissionCheck = function(token, employeeID, callback) {
  if (token) {
    //console.log('hi');
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        //console.log('there');
        callback(apiError.successError(false, 'Token authentication failure'));
      } else {
        //console.log('decoded: ', decoded);
        queries.validateUser(dbconnect, decoded.email, decoded.password, employeeID, function(err, results) {
          if (err) {
           callback(apiError.successError(false, 'adminDeletePermissionCheck failed'));
         } else {
           if (isEmpty(results)) {
             callback(apiError.successError(false, 'Error: invalid parameters'));
           } else {
             employee1 = {employeeID : results[0].EID, permissionLevel: results[0].EP};
             employee2 = {employeeID : results[0].AID, permissionLevel: results[0].AP};
             if (employee1.permissionLevel == 'user') {
               callback(apiError.successError(false, 'Permission denied. Must be an admin or superadmin'));
             } else if (employee1.permissionLevel == 'admin' && employee2.permissionLevel == 'admin' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. admins cannot delete other admins'));
             } else if (employee1.permissionLevel == 'admin' && employee2.permissionLevel == 'superadmin') {
               callback(apiError.successError(false, 'Permission denied. admins cannot delete superadmins'));
             } else if (employee1.permissionLevel == 'superadmin' && employee2.permissionLevel == 'superadmin' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. superadmins cannot delete other superadmins'));
             } else if (employee1.permissionLevel == 'admin' || employee1.permissionLevel == 'superadmin') {
               queries.isEmployeeLastSuperadmin(dbconnect, employee2.employeeID, function(err, data) {
                 if (err) {
                   callback(apiError.successError(false, 'superadminDeletePermissionCheck query failure with last superadmin'));
                 } else {
                   if (data[0].result == 0) {
                     callback(apiError.successError(false, 'Last superadmin in system cannot be deleted'));
                   } else {
                     callback(apiError.successError(true, 'admin delete access granted'));
                   }
                 }
               });
             } else {
               callback(apiError.successError(false, 'Permission denied. Invalid permission level'));
             }
           }
         }
        });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};

exports.userPermissionCheck = function(token, employeeID, callback) {
  var employee1;
  var employee2;
  if (token) {
    //console.log('hi');
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        //console.log('there');
        callback(apiError.successError(false, 'Token authentication failure'));
      } else {
        //console.log('decoded: ', decoded);
        queries.validateUser(dbconnect, decoded.email, decoded.password, employeeID, function(err, results) {
          if (err) {
           callback(apiError.successError(false, 'userPermissionCheck failed'));
         } else {
           if (isEmpty(results)) {
             callback(apiError.successError(false, 'Error: invalid parameters'));
           } else {
             employee1 = {employeeID : results[0].EID, permissionLevel: results[0].EP};
             employee2 = {employeeID : results[0].AID, permissionLevel: results[0].AP};
             if (employee1.permissionLevel == 'user' && (employee2.permissionLevel == 'admin' || employee2.permissionLevel == 'superadmin')) {
               callback(apiError.successError(false, 'Permission denied. Must be an admin or superadmin'));
             } else if (employee1.permissionLevel == 'user' && employee2.permissionLevel == 'user' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. users cannot edit other employees'));
             } else if (employee1.permissionLevel == 'admin' && employee2.permissionLevel == 'admin' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. admins cannot edit other admins'));
             } else if (employee1.permissionLevel == 'admin' && employee2.permissionLevel == 'superadmin') {
               callback(apiError.successError(false, 'Permission denied. admins cannot edit superadmins'));
             } else if (employee1.permissionLevel == 'superadmin' && employee2.permissionLevel == 'superadmin' && employee1.employeeID != employee2.employeeID) {
               callback(apiError.successError(false, 'Permission denied. superadmins cannot edit other superadmins'));
             } else {
               callback(apiError.successError(true, 'user access granted'));
             }
           }
         }
        });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};

exports.readTextFile = function(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        return allText;
      }
    }
  }
  rawFile.send(null);
};
