var apiError = require('../database/api_responses/api_errors');
var apiSuccess = require('../database/api_responses/api_successes');
var bcrypt = require('bcrypt');
var csvParser = require('csv-parse');
var env = require('../env');
var exec = require('child_process').exec;
var express = require('express');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var path = require('path');
var postmark = require("postmark");
//var queries = require('../database/query/queries');
//var all_queries = require('../database/all_queries');
var queries = require('../database/all_queries');
var router = express.Router();
var uuid = require('node-uuid');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var pub = fs.readFileSync(path.join(__dirname+"./../sslcert/localhost.pem"));
var priv = fs.readFileSync(path.join(__dirname+"./../sslcert/localhost.key"));

/**************** Utility Functions ****************/
function isInt(value) {
  return !isNaN(value) &&  parseInt(Number(value)) == value &&   !isNaN(parseInt(value, 10));
};

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
};

function employeePropertiesToArray(employee) {
  return Object.keys(employee).map(function(k) {
    return employee[k];
  });
};

function superadminPermissionCheck(token, callback) {
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

function superadminDeletePermissionCheck(token, employeeID, callback) {
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

function adminPermissionCheck(token, callback) {
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

function adminDeleteOfficePermissionCheck(token, officeID, callback) {
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
           callback(apiError.successError(false, 'adminDeleteOfficePermissionCheck failed'));
         } else {
           var employee = results[0];
           if (employee.permissionLevel == 'superadmin') {
             callback(apiError.successError(true, 'admin delete access granted'));
           } else if (employee.permissionLevel == 'admin') {
             queries.verifyOfficeForEmployee(dbconnect, employee.employeeID, officeID, function(err, results) {
               if (err) {
                callback(apiError.successError(false, 'adminDeleteOfficePermissionCheck failed office query'));
              } else {
                if (isEmpty(results)) {
                  callback(apiError.successError(false, 'Error: invalid parameters'));
                } else {
                  if (results[0].result) {
                    callback(apiError.successError(true, 'admin delete access granted'));
                  } else {
                    callback(apiError.successError(false, 'Permission denied. Cannot delete office of another admin'));
                  }
                }
              }
             });
           } else {
             callback(apiError.successError(false, 'Permission denied. Must be admin or superadmin'));
           }
         }
        });
      }
    });
  } else {
    callback(apiError.successError(false, 'No token provided'));
  }
};


function adminDeletePermissionCheck(token, employeeID, callback) {
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

function userPermissionCheck(token, employeeID, callback) {
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

function readTextFile(file) {
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

/**************** Database Connection ****************/
var dbconnect = queries.getInitialConnection();
dbconnect.connect(function(err) {
  if (!err) {
    console.log("Connected to MySQL");
    queries.existsDatabase(dbconnect, function (err, data) {
      if (data[0].result == 1) {
        queries.useDatabase(dbconnect);
        console.log("Connected to seating_lucid_agency database");
        queries.existsSuperadmin(dbconnect, function(err, answer){
          if (answer[0].result == 0) {
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash('1234', salt, function(err, hash) {
                var employee = {
                  firstName : 'Superadmin',
                  lastName : 'I',
                  email : 'superadmin@seatinglucidagency',
                  password : hash,
                  department : 'IT',
                  title : 'Super Admin',
                  restroomUsage : 1,
                  noisePreference : 1,
                  outOfDesk : 1,
                  pictureAddress : '',
                  permissionLevel : 'superadmin'
                };
                queries.addEmployee(dbconnect, employee, function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Superadmin created");
                  }
                });
              });
            });
          }
        });
      } else {
        console.log("Creating seating_lucid_agency");
        queries.createDatabase(dbconnect);
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash('1234', salt, function(err, hash) {
            var employee = {
              firstName : 'Superadmin',
              lastName : 'I',
              email : 'superadmin@seatinglucidagency',
              password : hash,
              department : 'IT',
              title : 'Super Admin',
              restroomUsage : 1,
              noisePreference : 1,
              outOfDesk : 1,
              pictureAddress : '',
              permissionLevel : 'superadmin'
            };
            queries.addEmployee(dbconnect, employee, function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Superadmin created");
              }
            });
          });
        });
        console.log("Database successfully initialized");
      }
    });
  } else if (env.logErrors) {
    console.log("Error connecting to MySQL", err);
  } else {
    console.log("Error connecting to MySQL");
  }
});

/**************** Login Implementationn ****************/
// Create a token if an employee signs in
router.post('/Authenticate', function(req, res) {
  var employee = null;
  var u;
  var p;
  var dbUser;
  var token;

  try {
    employee = JSON.parse(JSON.stringify(req.body));
  } catch (e) {
    return res.json(apiError.errors("400","Error parsing JSON"));
  }
  u = employee.email;
  p = employee.password;
  if ( u === undefined || u === null || p === undefined || p === null) {
    res.json(apiError.errors("400", "Missing parameters"));
  } else {
    queries.getUser(dbconnect, employee, function(err, rows) {
      if (!err) {
        if (rows.length < 1) {
          res.json(apiError.successError(false,'Authentication failed. Employee not found.'));
        } else {
          dbUser = JSON.parse(JSON.stringify(rows[0]));
          if (dbUser.email === u && bcrypt.compareSync(p, dbUser.password)) {
            employee.password = dbUser.password;
            token = jwt.sign(employee, env.key, {
              expiresIn: moment().add(1, 'days').valueOf() // expires in 24 hours
            });
            res.json(apiSuccess.successToken(true, 'Enjoy your token!', token));
          } else {
            res.json(apiError.successError(false, 'Authentication failed. Incorrect Credentials.'));
          }
        }
      } else {
        res.json(apiError.successError(false, 'Authentication failed. Employee not found.'));
      }
    });
  }
});

// Verify the token and decode
router.get('/Verify/', function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        res.json(apiError.successError(false, 'Failed to authenticate token.'));
      } else {
        // If everything is good, save to request for use in other routes
        if (decoded.exp <= Date.now()) {
          return res.json(apiError.errors("400", "Token has expired"));
        } else {
          req.decoded = decoded;
          //console.log(req.decoded);
          queries.validatedToken(dbconnect, req.decoded.email, req.decoded.password, function(err, results) {
            return res.json(results);
          });
        }
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.json(apiError.successError(false, 'No token provided.'));
  }
});

router.get('/Authenticate', function(req, res) {
  res.json(apiError.errors("403","Access denied"));
});

/**************** Non-Confidential ****************/
router.get('/Media/DefaultImage/', function (req, res, next) {
  var address;

  address = path.join(__dirname+"./../public/documents/default.jpg");
  //console.log(address);
  res.sendFile(address);
});

router.get('/Media/ProfileImage/:id', function (req, res, next) {
  var employeeID = req.params.id;
  var address;

  if (!isInt(employeeID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getEmployeeProfileImage(dbconnect, employeeID, function(err, result) {
    if (err) {
      res.json(apiError.errors("500","Error with get employee profile image query in database"));
    } else {
      address = result[0].pictureAddress;
      address = path.join(__dirname+"./../public/documents/" + address);
      //console.log(address);
      res.sendFile(address);
    }
  });
});

router.post('/PasswordResetEmailCheck', function(req, res) {
  console.log("got here");
  var user = JSON.parse(JSON.stringify(req.body));
  queries.getUser(dbconnect, user, function(err, data) {
    console.log(data);
    if (data.length>0) {
      res.json({ success: true, message: 'User found.', data });
    }
    else {
      res.json({ success: false, message: 'No such user.' });
    }
  });
});

router.post('/AddPasswordReset',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var adder = {
    token: data.token,
    employee_ID : data.employeeID
  };

  //console.log(adder);
  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("500", err.toString(), data));
    } else {
      queries.addPasswordReset(dbconnect, adder, function (err) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        }
        //add email

        var postmark = require("postmark");
        var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
        console.log(data.employeeID)
        queries.getOneEmployeeConfidential(dbconnect, data.employeeID, function(err, data) {
          console.log(data[0].email);

          client.sendEmail({
            "From": "info@lucidseat.com",
            "To": data[0].email,
            "Subject": 'Someone has Updated their Password',
            "TextBody": "Please use the following URL to reset your password: lucidseat.com/password-reset/"+adder.token
          });
        });

      });
    }
  });
  res.json(apiSuccess.successQuery(true, "Temporary reset password added to office in seating_lucid_agency"));
});

router.get('/PasswordReset/:token',function(req, res, next) {
  queries.getPasswordReset(dbconnect, req.params.token, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Token " + req.params.token +": " , data);
      res.json(data);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

router.post('/PasswordResetUpdate', function(req, res) {
  var user = JSON.parse(JSON.stringify(req.body));
  console.log(user);
  queries.getOneEmployeeConfidential(dbconnect, user.employeeID, function(err, data) {
    var query = JSON.parse(JSON.stringify(data));
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    }
    else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          var employee = {
            firstName : query[0].firstName,
            lastName : query[0].lastName,
            email : query[0].email,
            password : hash,
            department : query[0].department,
            title : query[0].title,
            restroomUsage : query[0].restroomUsage,
            noisePreference : query[0].noisePreference,
            outOfDesk : query[0].outOfDesk,
            pictureAddress : query[0].pictureAddress,
            permissionLevel : query[0].permissionLevel
          };
          queries.editEmployee(dbconnect, employee, user.employeeID);
          res.json(apiSuccess.successQuery(true, "Password is updated in seating_lucid_agency"));
        });
      });
    }
  });
});

router.get('/DeletePasswordReset/:id', function(req, res) {
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.deletePasswordReset(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Temporary reset password deleted in seating_lucid_agency"));
});

/**************** MUST HAVE CREDENTIALS FOR THE FOLLOWING HTTP METHODS ****************/
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, env.key, function(err, decoded) {
      if (err) {
        return res.status(403).send(apiError.successError(false, 'Failed to authenticate token.'));
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        //console.log(req.decoded);
        req.session.employee = req.decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send(apiError.successError(false, 'No token provided.'));
  }
});

/**************** File Upload ****************/
var multer  = require('multer');
// File Upload
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/documents');
  },
  filename: function (req, file, callback) {
    //get filename and change it to a new name using a uuid
    //for example the following file in public/documents folder with fileName
    //367db834-5dfc-43c3-971e-c7cad28c36b91454213265978.jpg
    //https://localhost/documents/367db834-5dfc-43c3-971e-c7cad28c36b91454213265978.jpg
    var originalname =file.originalname;
    var fileExtension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2);
    var fileName = uuid.v4();
    var newFileName = fileName + Date.now() + '.'+ fileExtension;
    callback(null, newFileName);
  }
});
var upload = multer({ storage: storage });

router.post('/Upload/Image', upload.single('file'), function (req, res, next) {
  var file = req.file;
  var data = JSON.parse(JSON.stringify(req.body));
  var adder = {
    pictureAddress: file.filename,
    employeeID: data.employeeID
  };

  // Update Employee Profile Image
  queries.updateEmployeeProfileImage(dbconnect, adder);
  res.status(204).end();
});

router.post('/Upload/CSV', upload.single('file'), function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var file = req.file;
      var rs = fs.createReadStream(file.path);
      parser = csvParser({columns: true}, function(err, employees) {
        if (err) {
          res.json(apiError.errors("400","Error with parsing JSON"));
        } else {
          var values=[];
          for( var i in employees) {
            //gets the employee
            employee= JSON.parse(JSON.stringify(employees[i]));
            //converts json to array
            var arr = employeePropertiesToArray(employee);
            values.push(arr);
          }
        }
      });
      rs.pipe(parser);
      //console.log(file.filename);
      res.status(204).end();
    } else {
      return res.json(check);
    }
  });
});

/**************** Algorithm Call *****************/
router.post('/Algorithm/Execute', function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var address = path.join(__dirname + "./../seating_chart_algorithm");
      var similarityFile = address + "/similarity_files/" + data.similarityFile;
      var employeeFile = address + "/employee_files/" +  data.employeeFile;
      var chartFile = address + "/chart_files/" +  data.chartFile;
      var output = address + "/output/" + data.output;
      var cmd = 'java -jar ' + address+'/Algorithm.jar ' + chartFile + ' ' + employeeFile + ' ' + similarityFile + ' ' + output;
      //console.log(cmd);
      var result;
      //console.log(cmd);
      exec(cmd, function(error, stdout, stderr) {
        //console.log(stdout);
        result = readTextFile(address + 'output.json');
        console.log(result);
      });
      res.json(apiError.successError(true, 'algorithm executed'));
    } else {
      return res.json(check);
    }
  });
});

/**************** Add Queries ****************/
router.post('/AddCompany',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      //console.log(req.body);
      var data = JSON.parse(JSON.stringify(req.body));
      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var company = {
            companyName : data.companyName
          };
          queries.addCompany(dbconnect, company, function(err) {
            if (err) {
              return res.json(apiError.queryError("500", err.toString(), data));
            } else {
              //console.log("Company added!");
              queries.getLastCompany(dbconnect, function(err, results) {
                if (err) {
                  return res.json(apiError.queryError("500", err.toString(), data));
                } else {
                  //console.log("Last company ID retrieved");
                  //console.log(results);
                  queries.addAllSuperadminToCompany(dbconnect, results[0].companyID);
                  return res.json(apiSuccess.successQuery(true, "Company added to seating_lucid_agency"));
                }
              });
            }
          });
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddCluster',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var cluster = {
            xcoordinate : data.xcoordinate,
            ycoordinate : data.ycoordinate
          };
          queries.addCluster(dbconnect, cluster);
          return res.json(apiSuccess.successQuery(true, "Cluster added to seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddDesk',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var desk = {
            xcoordinate : data.xcoordinate,
            ycoordinate : data.ycoordinate,
            width : data.width,
            height : data.height
          };
          queries.addDesk(dbconnect, desk);
          return res.json(apiSuccess.successQuery(true, "Desk added to seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddEmployee',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var officeID;
      var companyID;
      var permissionLevel;

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
          req.getConnection(function(err, connection) {
            var employee = {
              firstName : data.firstName,
              lastName : data.lastName,
              email : data.email,
              password : hash,
              department : data.department,
              title : data.title,
              restroomUsage : data.restroomUsage,
              noisePreference : data.noisePreference,
              outOfDesk : data.outOfDesk,
              pictureAddress : data.pictureAddress,
              permissionLevel : data.permissionLevel
            };
            officeID = data.officeID;
            companyID = data.companyID;
            permissionLevel = data.permissionLevel;
            queries.addEmployee(dbconnect, employee, function (err) {
              if (err) {
                return res.json(apiError.queryError("500", err.toString(), data));
              } else {
                queries.getUser(dbconnect, {email: data.email}, function(err, results) {
                  if (err) {
                    return res.json(apiError.queryError("500", err.toString(), data));
                  } else {
                    var employeeID = results[0].employeeID;
                    if (isInt(officeID)) {
                      queries.addEmployeeToOffice(dbconnect, {employeeKey : employeeID, officeKey : officeID});
                    }
                    if (isInt(companyID) && permissionLevel == "admin") {
                      queries.addAdminToCompany(dbconnect, {admin_ID: employeeID, company_ID: companyID}, function (err) {
                        if (err) {
                          return res.json(apiError.queryError("500", err.toString(), data));
                        }
                      });
                    } else if (isInt(companyID) && permissionLevel == "superadmin") {
                      queries.addSuperadminToAllCompanies(dbconnect, employeeID);
                    }
                    if (isInt(data.temperatureRangeID)) {
                      queries.addRangeToEmployee(dbconnect, {employeeID: employeeID, rangeID: data.temperatureRangeID});
                    }
                    var item = 0;
                    for (item in data.teammates) {
                      queries.addTeammate(dbconnect, {idemployee_teammates: employeeID, employee_teammate_id: data.teammates[item].employeeID});
                    }
                    for (item in data.blacklist) {
                      queries.addToBlackList(dbconnect, {idemployee_blacklist: employeeID, employee_blacklist_teammate_id: data.blacklist[item].employeeID});
                    }
                    for (item in data.whitelist) {
                      queries.addToWhiteList(dbconnect, {idemployee_whitelist: employeeID, employee_whitelist_teammate_id: data.whitelist[item].employeeID});
                    }
                    return res.json(apiSuccess.successQuery(true, "Employee added to seating_lucid_agency"));
                  }
                });
              }
            });
          });
        });
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddEmployees',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var values = JSON.parse(JSON.stringify(req.body));
      var officeID = values.officeID;

      values = values.employees;
      for (var data in values) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(values[data].password, salt);
        var employee = {
          firstName : values[data].firstName,
          lastName : values[data].lastName,
          email : values[data].email,
          password : hash,
          department : values[data].department,
          title : values[data].title,
          restroomUsage : values[data].restroomUsage,
          noisePreference : values[data].noisePreference,
          outOfDesk : values[data].outOfDesk,
          pictureAddress : values[data].pictureAddress,
          permissionLevel : values[data].permissionLevel
        };
        queries.addEmployeeSync(dbconnect, employee, officeID);
      }
      return res.json(apiSuccess.successQuery(true, "Employees added to seating_lucid_agency from CSV"));
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddAdminToCompany',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var adder = {
        admin_ID : data.employeeID,
        company_ID : data.companyID
      };
      queries.addAdminToCompany(dbconnect, adder, function(err) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          return res.json(apiSuccess.successQuery(true, "Admin added to company in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddEmployeeToOffice',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var adder = {
            employeeKey : data.employeeID,
            officeKey : data.officeID
          };
          queries.addEmployeeToOffice(dbconnect, adder);
          return res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddInitialOfficeWithEmployee',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var office = {
        officeName: data.officeName,
        officePhoneNumber: data.officePhoneNumber,
        officeEmail: data.officeEmail,
        officeStreetAddress: data.officeStreetAddress,
        officeCity: data.officeCity,
        officeState: data.officeState,
        officeZipcode: data.officeZipcode
      };
      var employeeID = data.employeeID;
      var officeID = 0;
      var companyID = data.companyID;
      var adder1;
      var adder2;

      req.getConnection(function(err, connection) {
        queries.addOffice(dbconnect, office, function(err) {
          if (err) {
            res.json(apiError.queryError("500", err.toString(), data));
          } else {
            queries.getMostRecentOffice(dbconnect, function(err, results) {
              if (err) {
                res.json(apiError.queryError("500", err.toString(), data));
              } else {
                officeID = results[0].officeID;
                adder1 = {
                  employeeKey : employeeID,
                  officeKey : officeID
                };
                adder2 = {
                  IDforOffice : officeID,
                  IDforCompany : companyID
                };
                //queries.addEmployeeToOffice(dbconnect, adder1);
                queries.addOfficeToCompany(dbconnect, adder2);
                return res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
              }
            });
          }
        });
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddOffice',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var office = {
            officeName: data.officeName,
            officePhoneNumber: data.officePhoneNumber,
            officeEmail: data.officeEmail,
            officeStreetAddress: data.officeStreetAddress,
            officeCity: data.officeCity,
            officeState: data.officeState,
            officeZipcode: data.officeZipcode
          };
          var companyID = data.companyID;
          var officeID = 1;
          var adder;

          queries.addOffice(dbconnect, office, function(err) {
            if (err) {
              res.json(apiError.queryError("500", err.toString(), data));
            } else {
              queries.getMostRecentOffice(dbconnect, function(err, results) {
                if (err) {
                  res.json(apiError.queryError("500", err.toString(), data));
                } else {
                  officeID = results[0].officeID;
                  adder = {
                    IDforOffice : officeID,
                    IDforCompany : companyID
                  };
                  queries.addOfficeToCompany(dbconnect, adder);
                  return res.json(apiSuccess.successQuery(true, "Office added in seating_lucid_agency"));
                }
              });
            }
          });
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddOfficeEmployee',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
          req.getConnection(function(err, connection) {
            var employee = {
              firstName : data.firstName,
              lastName : data.lastName,
              email : data.email,
              password : hash,
              department : data.department,
              title : data.title,
              restroomUsage : data.restroomUsage,
              noisePreference : data.noisePreference,
              outOfDesk : data.outOfDesk,
              pictureAddress : data.pictureAddress,
              permissionLevel : data.permissionLevel
            };
            var officeID = data.officeID;
            queries.addEmployee(dbconnect, employee, function (err) {
              if (err) {
                return res.json(apiError.queryError("500", err.toString(), data));
              } else {
                queries.getUser(dbconnect, {email: data.email}, function(err, results) {
                  if (err) {
                    return res.json(apiError.queryError("500", err.toString(), data));
                  } else {
                    var employeeID = results[0].employeeID;
                    var adder = {
                      employeeKey: employeeID,
                      officeKey : officeID
                    };
                    queries.addEmployeeToOffice(dbconnect, adder);
                    return res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
                  }
                });
              }
            });
          });
        });
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddTeammatesToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, data.employeeID, function(check) {
    if (check.success) {

      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var adder = [];
          var employeeID = data.employeeID;

          for (var item in data.teammates) {
            adder.push(item.employeeID);
          }
          for (var i in adder) {
            queries.addTeammate(dbconnect, {idemployee_teammates: employeeID, employee_teammate_id: adder[i]});
            return res.json(apiSuccess.successQuery(true, "Teammates added to employee in seating_lucid_agency"));
          }
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddTemperatureRange',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));

      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var temperatureRange = {
            lower : data.lower,
            upper : data.upper
          };
          queries.addRange(dbconnect, temperatureRange);
          return res.json(apiSuccess.successQuery(true, "Temperature range added in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/AddTemperatureRangeToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, data.employeeID, function(check) {
    if (check.success) {

      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var adder = {
            employeeID : data.employeeID,
            rangeID : data.temperatureRangeID
          };
          queries.addRangeToEmployee(dbconnect, adder);
          return res.json(apiSuccess.successQuery(true, "Temperature range added to employee in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

// Routing for the Delete queries
router.get('/DeleteCompany/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.getAllOfficesForOneCompany(dbconnect, ID, function(err, data) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else if (env.logQueries) {
          //console.log("Deleting Company: ", ID);
          for (var item in data) {
            queries.getAllEmployeesForOneOfficeConfidential(dbconnect, data[item].officeID, function(err, result) {
              if (err) {
                return res.json(apiError.queryError("500", err.toString(), data));
              } else if (env.logQueries) {
                //console.log("Delete office: ", data[item].officeID);
                for (var i in result) {
                  if (result[i].permissionLevel != 'superadmin') {
                    queries.deleteEmployee(dbconnect, result[i].employeeID);
                  } else if (result[i].permissionLevel == 'superadmin') {
                    queries.deleteEmployeeFromOffice(dbconnect, result[i].employeeID);
                  }
                }
                queries.deleteOffice(dbconnect, ID);
              } else {
                for (var i in result) {
                  if (result[i].permissionLevel != 'superadmin') {
                    queries.deleteEmployee(dbconnect, result[i].employeeID);
                  } else if (result[i].permissionLevel == 'superadmin') {
                    queries.deleteEmployeeFromOffice(dbconnect, result[i].employeeID);
                  }
                }
                queries.deleteOffice(dbconnect, ID);
              }
            });
          }
          queries.deleteCompany(dbconnect, ID);
          return res.json(apiSuccess.successQuery(true, "Company deleted in seating_lucid_agency"));
        } else {
          for (var item in data) {
            queries.getAllEmployeesForOneOfficeConfidential(dbconnect, data[item].officeID, function(err, result) {
              if (err) {
                res.json(apiError.queryError("500", err.toString(), data));
              } else if (env.logQueries) {
                for (var i in result) {
                  if (result[i].permissionLevel != 'superadmin') {
                    queries.deleteEmployee(dbconnect, result[i].employeeID);
                  } else if (result[i].permissionLevel == 'superadmin') {
                    queries.deleteEmployeeFromOffice(dbconnect, result[i].employeeID);
                  }
                }
                queries.deleteOffice(dbconnect, ID);
              } else {
                for (var i in result) {
                  if (result[i].permissionLevel != 'superadmin') {
                    queries.deleteEmployee(dbconnect, result[i].employeeID);
                  } else if (result[i].permissionLevel == 'superadmin') {
                    queries.deleteEmployeeFromOffice(dbconnect, result[i].employeeID);
                  }
                }
                queries.deleteOffice(dbconnect, ID);
              }
            });
          }
          queries.deleteCompany(dbconnect, ID);
          return res.json(apiSuccess.successQuery(true, "Company deleted in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.get('/DeleteEmployee/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminDeletePermissionCheck(token, req.params.id, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.deleteEmployee(dbconnect, ID);
      return res.json(apiSuccess.successQuery(true, "Employee deleted in seating_lucid_agency"));
    } else {
      return res.json(check);
    }
  });
});

router.get('/DeleteOfficeEmployee/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminDeletePermissionCheck(token, req.params.id, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.deleteEmployee(dbconnect, ID);
      return res.json(apiSuccess.successQuery(true, "Employee deleted in seating_lucid_agency"));
    } else {
      return res.json(check);
    }
  });
});

router.get('/DeleteEmployeeFromOffice/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, req.params.id, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.deleteEmployeeFromOffice(dbconnect, ID);
      return res.json(apiSuccess.successQuery(true, "Employee deleted in seating_lucid_agency"));
    } else {
      return res.json(check);
    }
  });
});

router.get('/DeleteOffice/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
  //adminDeleteOfficePermissionCheck(token, req.params.id, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.getAllEmployeesForOneOfficeConfidential(dbconnect, ID, function(err, data) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else if (env.logQueries) {
          //console.log("Delete office: ", ID);
          for (var item in data) {
            if (data[item].permissionLevel != 'superadmin') {
              queries.deleteEmployee(dbconnect, data[item].employeeID);
            } else if (data[item].permissionLevel == 'superadmin') {
              queries.deleteEmployeeFromOffice(dbconnect, data[item].employeeID);
            }
          }
          queries.deleteOffice(dbconnect, ID);
        } else {
          for (var item in data) {
            if (data[item].permissionLevel != 'superadmin') {
              queries.deleteEmployee(dbconnect, data[item].employeeID);
            } else if (data[item].permissionLevel == 'superadmin') {
              queries.deleteEmployeeFromOffice(dbconnect, data[item].employeeID);
            }
          }
          queries.deleteOffice(dbconnect, ID);
          return res.json(apiSuccess.successQuery(true, "Office deleted in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.get('/DeletePasswordResetForEmployee/:employeeID', function(req, res) {
  var ID = req.params.employeeID;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.deletePasswordResetForEmployee(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Temporary reset password deleted in seating_lucid_agency"));
});

router.get('/DeleteAdminFromCompany/:adminID/:companyID', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var admin_ID = req.params.adminID;
      var company_ID = req.params.companyID;

      if (!isInt(admin_ID) || !isInt(company_ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.deleteAdminToCompany(dbconnect, admin_ID, company_ID);
      return res.json(apiSuccess.successQuery(true, "Admin " + admin_ID + " deleted from company " + company_ID));
    } else {
      return res.json(check);
    }
  });
});

// router.get('/DeleteEntireBlackListForEmployee/:id', function(req, res) {
//   var ID = req.params.id;
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   userPermissionCheck(token, ID, function(check) {
//     if (check.success) {
//       if (!isInt(ID)) {
//         return res.json(apiError.errors("400","Incorrect parameters"));
//       }
//       queries.deleteEntireBlackListForEmploye(dbconnect, ID);
//       return res.json(apiSuccess.successQuery(true, "Blacklist deleted in seating_lucid_agency for employee " + ID));
//     } else {
//       return res.json(check);
//     }
//   });
// });
//
// router.get('/DeleteEntireWhiteListForEmployee/:id', function(req, res) {
//   var ID = req.params.id;
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   userPermissionCheck(token, ID, function(check) {
//     if (check.success) {
//       if (!isInt(ID)) {
//         return res.json(apiError.errors("400","Incorrect parameters"));
//       }
//       queries.deleteEntireWhiteListForEmploye(dbconnect, ID);
//       return res.json(apiSuccess.successQuery(true, "Whitelist deleted in seating_lucid_agency for employee " + ID));
//     } else {
//       return res.json(check);
//     }
//   });
// });

router.get('/DeleteTemperatureRange/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      queries.deleteRange(dbconnect, ID);
      return res.json(apiSuccess.successQuery(true, "Temperature Range deleted in seating_lucid_agency"));
    } else {
      return res.json(check);
    }
  });
});

/**************** Edit Queries ****************/
router.post('/EditCompany/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var company = {
            companyName : data.companyName
          };
          queries.editCompany(dbconnect, company, ID);
          return res.json(apiSuccess.successQuery(true, "Company edited in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/UpdateCoworkers/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, ID, function(check) {
    if (check.success) {
      var whitelist = data.whitelist;
      var blacklist = data.blacklist;
      var employee = null;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          queries.deleteEntireBlackListForEmployee(dbconnect, ID);
          queries.deleteEntireWhiteListForEmployee(dbconnect, ID);
          for (employee in blacklist) {
            queries.addToBlackList(dbconnect, {idemployee_blacklist: ID, employee_blacklist_teammate_id: blacklist[employee].employeeID});
          }
          for (employee in whitelist) {
            queries.addToWhiteList(dbconnect, {idemployee_whitelist: ID, employee_whitelist_teammate_id: whitelist[employee].employeeID});
          }
          return res.json(apiSuccess.successQuery(true, "Employee coworkers updated in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditEmployee/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, req.params.id, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var employee = {
            firstName : data.firstName,
            lastName : data.lastName,
            email : data.email,
            department : data.department,
            title : data.title,
            restroomUsage : data.restroomUsage,
            noisePreference : data.noisePreference,
            outOfDesk : data.outOfDesk,
            pictureAddress : data.pictureAddress,
            haveUpdated : 1,
            accountUpdated: (new Date)
          };
          queries.editEmployee(dbconnect, employee, ID);
          return res.json(apiSuccess.successQuery(true, "Employee edited in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

// router.post('/EditEmployeePermission/:id', function(req, res) {
//   //console.log("got here");
//   var data = JSON.parse(JSON.stringify(req.body));
//   var ID = req.params.id;
//
//   if (!isInt(ID)) {
//     return res.json(apiError.errors("400","Incorrect parameters"));
//   }
//   req.getConnection(function(err, connection) {
//     if (err) {
//       res.json(apiError.queryError("500", err.toString(), data));
//     } else {
//       var employee = {
//         permissionLevel: data.permissionLevel,
//         haveUpdated : 1,
//         accountUpdated: (new Date)
//       };
//       queries.editEmployee(dbconnect, employee, ID);
//     }
//   });
//   res.json(apiSuccess.successQuery(true, "Employee upgraded to admin in seating_lucid_agency"));
// });

router.post('/EditAdminToCompany/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;
      var adder = {
        admin_ID: data.employeeID,
        company_ID: data.companyID
      };

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          queries.editAdminToCompany(dbconnect, adder, adder.admin_ID, ID);
          return res.json(apiSuccess.successQuery(true, "Moved Admin #"+ adder.admin_ID + " to Company #" + adder.company_ID));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditEmployeeUpdatedForOffice/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("500", err.toString(), data));
    } else {
      var office = {
        employeeUpdated: data.employeeUpdated
      };
      queries.editEmployeeUpdatedForOffice(dbconnect, office, ID);
      return res.json(apiSuccess.successQuery(true, "Employee edited for office in seating_lucid_agency"));
    }
  });
});

router.post('/EditEmployeeWorksAtOffice/:id', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;
      var adder = {
        employeeKey: data.employeeID,
        officeKey: data.officeID
      };

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          queries.editEmployeeToOffice(dbconnect, adder, adder.employeeKey, ID);
          return res.json(apiSuccess.successQuery(true, "Moved Employee #"+ adder.employeeID + " to Office #" + adder.officeID));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditOffice/:id',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  superadminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var office = {
            officeName: data.officeName,
            officePhoneNumber: data.officePhoneNumber,
            officeEmail: data.officeEmail,
            officeStreetAddress: data.officeStreetAddress,
            officeCity: data.officeCity,
            officeState: data.officeState,
            officeZipcode: data.officeZipcode
          };
          queries.editOffice(dbconnect, office, ID);
          return res.json(apiSuccess.successQuery(true, "Office edited in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditPasswordReset/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var adder = {
    token: data.token,
    time_created: (new Date),
    employee_ID: data.employee_ID
  };

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else {
      queries.editPasswordReset(dbconnect, adder, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Temporary reset password edited in seating_lucid_agency"));
});

router.post('/EditPasswordResetForEmployee/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var adder = {
    token: data.token,
    time_created: (new Date),
    employee_ID: data.employee_ID
  };

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else {
      queries.editPasswordResetForEmployee(dbconnect, adder, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Temporary reset password edited in seating_lucid_agency"));
});

router.post('/EditEmployeePreferences/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, ID, function(check) {
    if (check.success) {
      var temperatureRangeID = data.temperatureRangeID
      var employee = {
        restroomUsage : data.restroomUsage,
        noisePreference : data.noisePreference,
        outOfDesk : data.outOfDesk,
        haveUpdated : 1,
        accountUpdated: (new Date)
      };

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      //console.log("EmployeeID: " + ID + "\ntemperatureRangeID: " + temperatureRangeID);
      req.getConnection(function(err, connection) {
        if (err) {
          return res.json(apiError.queryError("500", err.toString(), data));
        } else {
          queries.editEmployee(dbconnect, employee, ID);
          queries.existsTemperatureRangeForEmployee(dbconnect, ID, function(err, result) {
            if (err) {
              return res.json(apiError.queryError("500", err.toString(), result));
            } else {
              //console.log(result[0]);
              if (result[0].RESULT == 1) {
                queries.editRangeToEmployee(dbconnect, {employeeID: ID, rangeID: temperatureRangeID}, ID);
              } else {
                queries.addRangeToEmployee(dbconnect, {employeeID: ID, rangeID: temperatureRangeID});
              }
              return res.json(apiSuccess.successQuery(true, "Employee preferences updated in seating_lucid_agency"));
            }
          });
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditEmployeeTeammates/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  userPermissionCheck(token, ID, function(check) {
    if (check.success) {
      var teammates = data.teammates;
      var employee = null;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          queries.deleteAllTeammatesForEmployee(dbconnect, ID);
          for (employee in teammates) {
            queries.addTeammate(dbconnect, {idemployee_teammates: ID, employee_teammate_id: teammates[employee].employeeID});
          }
          return res.json(apiSuccess.successQuery(true, "Employee teammates updated in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/EditTemperatureRange/:id',function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  adminPermissionCheck(token, function(check) {
    if (check.success) {
      var data = JSON.parse(JSON.stringify(req.body));
      var ID = req.params.id;

      if (!isInt(ID)) {
        return res.json(apiError.errors("400","Incorrect parameters"));
      }
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("500", err.toString(), data));
        } else {
          var temperatureRange = {
            lower : data.lower,
            upper : data.upper
          };
          queries.editRange(dbconnect, temperatureRange, ID);
          return res.json(apiSuccess.successQuery(true, "Temperature range edited in seating_lucid_agency"));
        }
      });
    } else {
      return res.json(check);
    }
  });
});

router.post('/UpdatePassword',function(req, res) {
  var passwords = JSON.parse(JSON.stringify(req.body));

  queries.getOneEmployeeConfidential(dbconnect, passwords.employeeID, function(err, data) {
    var query = JSON.parse(JSON.stringify(data));
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    }
    else {
      bcrypt.genSalt(10, function(err, salt) {
        if (bcrypt.compareSync(passwords.oldPassword, query[0].password)) {
          if (passwords.password===passwords.password2) {
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(passwords.password, salt, function(err, hash) {
                var employee = {
                  firstName : query[0].firstName,
                  lastName : query[0].lastName,
                  email : query[0].email,
                  password : hash,
                  department : query[0].department,
                  title : query[0].title,
                  restroomUsage : query[0].restroomUsage,
                  noisePreference : query[0].noisePreference,
                  outOfDesk : query[0].outOfDesk,
                  pictureAddress : query[0].pictureAddress,
                  permissionLevel : query[0].permissionLevel
                };
                queries.editEmployee(dbconnect, employee, passwords.employeeID);
                res.json(apiSuccess.successQuery(true, "Password is updated in seating_lucid_agency"));
              });
            });
          }
          else {
            res.json(apiError.successError(false, 'New passwords do not match.'));
          }
        }
        else {
          res.json(apiError.successError(false, 'Invalid: old password'));
        }
      });
    }
  });
});

router.post('/PasswordResetUpdate', function(req, res) {
  //console.log(user);
  var user = JSON.parse(JSON.stringify(req.body));
  queries.getOneEmployeeConfidential(dbconnect, user.employeeID, function(err, data) {
    var query = JSON.parse(JSON.stringify(data));
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    }
    else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          var employee = {
            firstName : query[0].firstName,
            lastName : query[0].lastName,
            email : query[0].email,
            password : hash,
            department : query[0].department,
            title : query[0].title,
            restroomUsage : query[0].restroomUsage,
            noisePreference : query[0].noisePreference,
            outOfDesk : query[0].outOfDesk,
            pictureAddress : query[0].pictureAddress,
            permissionLevel : query[0].permissionLevel
          };
          queries.editEmployee(dbconnect, employee, user.employeeID);
          res.json(apiSuccess.successQuery(true, "Password is updated in seating_lucid_agency"));
        });
      });
    }
  });
});

/**************** E-mail API ****************/
router.post('/SendEmail',function(req, res, next) {
  var emailData = JSON.parse(JSON.stringify(req.body));
  //console.log(emailData);
  //Admin Reasons: Password update, password reset request, employee preferences changed (daily)
  //User Reasons: When added to update profile, then 5 days later remind them, after that every 10 days, then suggest update every 92 days
  // Example request
  var postmark = require("postmark");
  var client = new postmark.Client("e1b0b5ca-9559-4ecb-a813-8f53cee568d2");
  if (emailData.reason ==='passwordUpdate') {
    queries.emailAdmins(dbconnect, function(err, data) {
      if (err) {
        res.json(apiError.queryError("500", err.toString(), data));
      } else if (env.logQueries) {
        //console.log("The list of employees : ", data);
        email=data;
      } else {
        admin=JSON.parse(JSON.stringify(data));
        for (var i in admin) {
          val = admin[i];
          client.sendEmail({
            "From": "info@lucidseat.com",
            "To": val.email,
            "Subject": 'Someone has Updated their Password',
            "TextBody": emailData.email+" has updated their password."
          });
        }
      }
    });
  } else if (emailData.reason ==='passwordReset') {
    //email Admin about it
    queries.emailAdmins(dbconnect, function(err, data) {
      if (err) {
        res.json(apiError.queryError("500", err.toString(), data));
      } else if (env.logQueries) {
        //console.log("The list of employees : ", data);
        email=data;
      } else {
        admin=JSON.parse(JSON.stringify(data));
        for (var i in admin) {
          val = admin[i];
          client.sendEmail({
            "From": "info@lucidseat.com",
            "To": val.email,
            "Subject": 'Someone has Requested a Password Reset',
            "TextBody": emailData.email+" has requested a password reset and has been given a temporary password."
          });
        }
      }
    });
    //email user about it
    client.sendEmail({
      "From": "info@lucidseat.com",
      "To": emailData.email,
      "Subject": 'Password Reset Requested!',
      "TextBody": "Please use the following URL to reset your password: lucidseat.com/password-reset/"+emailData.token
    });

  } else if (emailData.reason ==='employeeAdd') {
    //console.log("got here");
    //console.log(emailData.to);
    client.sendEmail({
      "From": "info@lucidseat.com",
      "To": emailData.to,
      "Subject": 'Welcome to Lucid Seat!',
      "TextBody": "Welcome to Lucid Seat!  Please login and update your preferences now to get the perfect desk for you!  Your password is :  "+emailData.password+" and you can login at lucidseat.com"
    });
  }
  //console.log("finished");
  res.send("Email sent");
});

/**************** Initialization Checks ****************/
router.get('/ExistsCompany',function(req, res, next) {
  queries.existsCompany(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there a company? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsCompanyForAdmin/:id',function(req, res, next) {
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.existsCompanyForAdmin(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there a company for admin? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsEmployee/:id',function(req, res, next) {
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.existsEmployee(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there an employee? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsEmployeeInOffice/:id',function(req, res, next) {
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.existsEmployeeInOffice(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there the employee in office? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsOffice',function(req, res, next) {
  queries.existsOffice(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there an office? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsOfficeForAdmin/:id',function(req, res, next) {
  var ID = req.params.id;

  if (!isInt(ID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.existsOfficeForAdmin(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there an office for admin? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsSuperadminWithOffice',function(req, res, next) {
  queries.existsSuperadminWithOffice(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there a superadmin associated with an office? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsTemperatureRange',function(req, res, next) {
  queries.existsTemperatureRange(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there a temperature range? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

/**************** RESTful API ****************/
// GET /api page
router.get('/', function(req, res, next) {
  res.redirect('/');
});

/**************** Get Queries ****************/
router.get('/AdminsForCompany/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAdminsForCompany(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + "'s admins: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllAdminEmployees',function(req, res, next) {
  queries.getAllAdminEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of all admin empoloyees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllBlacklistEmployees',function(req, res, next) {
  queries.getAllBlacklistEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees and their blacklists : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllCompanies',function(req, res, next) {
  queries.getAllCompanies(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of companies : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllCompaniesForAllOffices',function(req, res, next) {
  queries.getCompaniesForAllOffices(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of companies : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllClusters',function(req, res, next) {
  queries.getAllClusters(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of clusters : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllClustersOfFloorplans',function(req, res, next) {
  queries.getAllClustersOfFloorplans(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of clusters of the floor plans : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllDesks',function(req, res, next) {
  queries.getAllDesks(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of desks : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllDesksWithEmployees',function(req, res, next) {
  queries.getAllDesksWithEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of desks with employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployees',function(req, res, next) {
  queries.getAllEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesConfidential',function(req, res, next) {
  queries.getAllEmployeesConfidential(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesNotSuperadmin',function(req, res, next) {
  queries.getAllEmployeesNotSuperAdmin(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees that are not superadmins : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllFloorPlans',function(req, res, next) {
  queries.getAllFloorPlans(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of floor plans : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllOffices',function(req, res, next) {
  queries.getAllOffices(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of offices : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllOfficesWithoutAnAdmin',function(req, res, next) {
  queries.getAllOfficesWithoutAnAdmin(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of offices without an assigned admin: ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesExcept/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllEmployeesExceptOne(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees except " + req.params.id + " : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTeammates',function(req, res, next) {
  queries.getAllTeammates(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees with their teammates : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRanges',function(req, res, next) {
  queries.getAllTempRanges(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("List of Temperature Ranges: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfClusters',function(req, res, next) {
  queries.getAllTempRangesOfClusters(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each cluster : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfEmployees',function(req, res, next) {
  queries.getAllTempRangesOfEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each employee : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfFloorplans',function(req, res, next) {
  queries.getAllTempRangesOfFloorplans(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each floor plan : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllWhitelistEmployees',function(req, res, next) {
  queries.getAllWhitelistEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees and their whitelists : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Company/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneCompany(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyOffices/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllOfficesForOneCompany(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + " offices: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyOfficesWithoutAnAdmin/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  //console.log('Check 1');
  queries.getAllOfficesWithoutAnAdminForOneCompany(dbconnect, req.params.id, function(err, data) {
    //console.log('Check 2');
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + " offices without an admin: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompaniesForAdmin/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getCompaniesForAdmin(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Admin #" + req.params.id + "'s companies: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyForOffice/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getCompanyForOneOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Cluster/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterDesks/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllDesksForOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s desks: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterTemperatureRange/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getTempRangeOfOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Desk/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneDesk(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Desk #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Employee/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeConfidential/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackList/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackListConfidential/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllBlacklistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeDesk/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getDeskOfEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s desk: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesOfOffice/:id',function(req, res, next) {
  queries.getAllEmployeesForOneOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office " + req.params.id + "'s employees: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammates/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllTeammatesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammatesConfidential/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllTeammatesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesNotInTeammates/:employeeID/:officeID',function(req, res, next) {
  if (!isInt(req.params.employeeID) || !isInt(req.params.officeID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllEmployeesNotInTeammatesForOffice(dbconnect, req.params.employeeID, req.params.officeID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("All employees not in teammates of #" + req.params.emloyeeID + ": ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTemperatureRange/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getTempRangeOfOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesUpdatedForOffice/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getEmployeeUpdatedForOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office " + req.params.id + "'s employee updated: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteList/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesNotInWhiteListOrBlackList/:employeeID/:officeID',function(req, res, next) {
  if (!isInt(req.params.employeeID) || !isInt(req.params.officeID)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllEmployeesNotInWhiteListOrBlackListForOffice(dbconnect, req.params.employeeID, req.params.officeID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("All employees not in whitelist or blacklist of #" + req.params.emloyeeID + ": ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteListConfidential/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllWhitelistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Floorplan/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneFloorPlan(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorplanClusters/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getAllClustersOfOneFloorplan(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorPlanOfOffice/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getFloorPlanOfOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan of Office" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

//
// Create Floor Plan
//
router.post('/FloorPlans',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  queries.addFloorPlan(dbconnect, data, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Floor plan created', result);
    }
    return res.json(result);
  });
});

//
// Read Floor Plans
//
router.get('/FloorPlans', function(req, res, next) {
  queries.getFloorPlans(dbconnect, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Floor Plans:' , result);
    }
    return res.json(result);
  });
});

//
// Read Floor Plan
//
router.get('/FloorPlans/:id', function(req, res, next) {
  var id = req.params.id;
  queries.getFloorPlan(dbconnect, id, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Floor Plans:' , result);
    }
    return res.json(result);
  });
});

//
// Update Floor Plan
//
router.put('/FloorPlans/:id', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;
  queries.updateFloorPlan(dbconnect, id, data, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Floor plan updated', result);
    }
    return res.json(result);
  });
});

//
// Delete Floor Plan
//
router.delete('/FloorPlans/:id', function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors('400', 'Incorrect parameters'));
  }
  queries.removeFloorPlan(dbconnect, req.params.id, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Floor plan #' + req.params.id + ' removed from database.');
    }
    return res.json(result);
  });
});

router.get('/IsEmployeeAdmin/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.isEmployeeAdmin(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee" + req.params.id + " is admin? " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/IsEmployeeSuperadmin/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.isEmployeeSuperadmin(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee" + req.params.id + " is superadmin? " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/IsEmployeeLastSuperadmin/:id',function(req, res, next) {
  //console.log('hey');
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.isEmployeeLastSuperadmin(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee" + req.params.id + " is the only superadmin? " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Office/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/OfficeOfEmployee/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOfficeOfEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office # for Employee " + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/PasswordResetForEmployee/:id',function(req, res, next) {
  console.log(req.params.id);
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getPasswordResetForEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Temporary password for employee #" + req.params.id +": " , data);
      res.json(data);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

//
// Create Seating Chart
//
router.post('/SeatingCharts',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  queries.addSeatingChart(dbconnect, data, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Seating chart created', result);
    }
    return res.json(result);
  });
});

//
// Read Seating Charts
//
router.get('/SeatingCharts', function(req, res, next) {
  queries.getSeatingCharts(dbconnect, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Seating Charts:' , result);
    }
    return res.json(result);
  });
});

//
// Read Seating Chart
//
router.get('/SeatingCharts/:id', function(req, res, next) {
  var id = req.params.id;
  queries.getSeatingChart(dbconnect, id, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Seating Charts:' , result);
    }
    return res.json(result);
  });
});

//
// Update Seating Chart
//
router.put('/SeatingCharts/:id', function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;
  queries.updateSeatingChart(dbconnect, id, data, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Seating chart updated', result);
    }
    return res.json(result);
  });
});

//
// Delete Seating Chart
//
router.delete('/SeatingCharts/:id', function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors('400', 'Incorrect parameters'));
  }
  queries.removeSeatingChart(dbconnect, req.params.id, function(err, result) {
    if (err) {
      return res.json(apiError.queryError('500', err.toString(), result));
    }
    if (env.logQueries) {
      console.log('Seating chart #' + req.params.id + ' removed from database.');
    }
    return res.json(result);
  });
});

router.get('/TemperatureRange/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getOneTempRange(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/User/:id',function(req, res, next) {
  if (!isInt(req.params.id)) {
    return res.json(apiError.errors("400","Incorrect parameters"));
  }
  queries.getUser(dbconnect, { email : req.params.id }, function(err, data) {
    if (err) {
      res.json(apiError.queryError("500", err.toString(), data));
    } else if (env.logQueries) {
      console.log("User data: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
