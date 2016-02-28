var apiError = require('../database/api_errors');
var apiSuccess = require('../database/api_successes');
var bcrypt = require('bcrypt');
var csvParser = require('csv-parse');
var env = require('../env');
var express = require('express');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var path = require('path');
var postmark = require("postmark");
var queries = require('../database/queries');
var router = express.Router();
var uuid = require('node-uuid');

/**************** Database Connection ****************/
var dbconnect = queries.getInitialConnection();
dbconnect.connect(function(err) {
  if (!err) {
    console.log("Connected to MySQL");
    queries.existsDatabase(dbconnect, function (err, data) {
      if (data[0].result == 1) {
        queries.useDatabase(dbconnect);
        console.log("Connected to seating_lucid_agency database");
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
              }
            });
          });
        });
      }
    });
  } else if (env.logErrors) {
    console.log("Error connecting to MySQL", err);
  } else {
    console.log("Error connecting MySQL");
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

router.get('/Media/ProfileImage/:id', function (req, res, next) {
  var employeeID = req.params.id;
  var address;

  queries.getEmployeeProfileImage(dbconnect, employeeID, function(err, result) {
    if (err) {
      res.json(apiError.errors("503","Error with get employee profile image query in database"));
    } else {
      address = result[0].pictureAddress;
      address = path.join(__dirname+"./../public/documents/" + address);
      console.log(address);
      res.sendFile(address);
    }
  });

});

function employeePropertiesToArray(employee) {
  return Object.keys(employee).map(function(k) {
     return employee[k];
   }
 );
};

router.post('/Upload/CSV', upload.single('file'), function (req, res, next) {
  var file = req.file;
  var rs = fs.createReadStream(file.path);
  parser = csvParser({columns: true}, function(err, employees) {
    if (err) {
      res.json(apiError.errors("401","Error with parsing JSON"));
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
    res.json(apiError.errors("401","Error parsing JSON"));
  }
  u = employee.email;
  p = employee.password;
  if ( u === undefined || u === null || p === undefined || p === null) {
    res.json(apiError.errors("401", "Missing parameters"));
  } else {
    queries.getUser(dbconnect, employee, function(err, rows) {
      if (!err) {
        if (rows.length < 1) {
          res.json(apiError.successError(false,'Authentication failed. Employee not found.'));
        } else {
            dbUser = JSON.parse(JSON.stringify(rows[0]));
            if (dbUser.email === u && bcrypt.compareSync(p, dbUser.password)) {
              employee.password = dbUser.password;
              token = jwt.sign(employee, "test", {
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
     jwt.verify(token, 'test', function(err, decoded) {
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
     return res.status(403).json(apiError.successError(false, 'No token provided.'));
   }
});

// Prevents access to page unless token is present
/*router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
   // decode token
   if (token) {
     // verifies secret and checks exp
     jwt.verify(token, 'test', function(err, decoded) {
       if (err) {
         return res.json({ success: false, message: 'Failed to authenticate token.' });
       } else {
         // if everything is good, save to request for use in other routes
         req.decoded = decoded;

         console.log(req.decoded);
         req.session.employee = req.decoded;
         next();
       }
     });
   } else {
     // if there is no token
     // return an error
     return res.status(403).send({
         success: false,
         message: 'No token provided.'
     });
   }
});*/

router.get('/Authenticate', function(req, res) {
  res.json(apiError.errors("403","Access denied"));
});

/**************** Initialization Checks ****************/
router.get('/ExistsCompany',function(req, res, next) {
  queries.existsCompany(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there a company? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsOffice',function(req, res, next) {
  queries.existsOffice(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Is there an office? 0 means no and 1 means yes: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ExistsSuperadminWithOffice',function(req, res, next) {
  queries.existsSuperadminWithOffice(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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

/**************** Add Queries ****************/
router.post('/AddCompany',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var company = {
        companyName : data.companyName
      };
      queries.addCompany(dbconnect, company);
    }
  });
  res.json(apiSuccess.successQuery(true, "Company added to seating_lucid_agency"));
});


router.post('/AddCluster',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var cluster = {
        xcoordinate : data.xcoordinate,
        ycoordinate : data.ycoordinate
      };
      queries.addCluster(dbconnect, cluster);
    }
  });
  res.json(apiSuccess.successQuery(true, "Cluster added to seating_lucid_agency"));
});

router.post('/AddDesk',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var desk = {
        xcoordinate : data.xcoordinate,
        ycoordinate : data.ycoordinate,
        width : data.width,
        height : data.height
      };
      queries.addDesk(dbconnect, desk);
    }
  });
  res.json(apiSuccess.successQuery(true, "Desk added to seating_lucid_agency"));
});

router.post('/AddEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var officeID;

  if ((data.officeID) != null && (typeof data.officeID !== 'undefined')) {
    officeID = data.officeID;
  } else {
    return res.json(apiError.queryError("401", "OfficeID is not defined", null));
  }
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
        queries.addEmployee(dbconnect, employee, function (err) {
          if (err) {
            return res.json(apiError.queryError("503", err.toString(), data));
          } else {
            queries.getUser(dbconnect, {email: data.email}, function(err, results) {
              if (err) {
                return res.json(apiError.queryError("503", err.toString(), data));
              } else {
                var employeeID = results[0].employeeID;

                if ((officeID) != null && (typeof officeID !== 'undefined')) {
                  queries.addEmployeeToOffice(dbconnect, {employeeKey : employeeID, officeKey : officeID});
                } else {
                  return res.json(apiError.queryError("401", "OfficeID is not defined", null));
                }
                queries.addRangeToEmployee(dbconnect, {employeeID: employeeID, rangeID: data.temperatureRangeID});
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
              }
            });
          }
        });
      });
    });
  });
  res.json(apiSuccess.successQuery(true, "Employee added to seating_lucid_agency"));
});

router.post('/AddEmployees',function(req, res, next) {
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
  res.json(apiSuccess.successQuery(true, "Employees added to seating_lucid_agency from CSV"));
});

router.post('/AddEmployeeToOffice',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      return res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var adder = {
        employeeKey : data.employeeID,
        officeKey : data.officeID
      };
      queries.addEmployeeToOffice(dbconnect, adder);
    }
  });
  res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
});

router.post('/AddInitialOfficeWithEmployee',function(req, res, next) {
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
        res.json(apiError.queryError("503", err.toString(), data));
      } else {
        queries.getMostRecentOffice(dbconnect, function(err, results) {
          if (err) {
            res.json(apiError.queryError("503", err.toString(), data));
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
            queries.addEmployeeToOffice(dbconnect, adder1);
            queries.addOfficeToCompany(dbconnect, adder2);
          }
        });
      }
    });
  });
  res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
});

router.post('/AddOffice',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
          res.json(apiError.queryError("503", err.toString(), data));
        } else {
          queries.getMostRecentOffice(dbconnect, function(err, results) {
            if (err) {
              res.json(apiError.queryError("503", err.toString(), data));
            } else {
              officeID = results[0].officeID;
              adder = {
                IDforOffice : officeID,
                IDforCompany : companyID
              };
              queries.addOfficeToCompany(dbconnect, adder);
            }
          });
        }
      });
    }
  });
  res.json(apiSuccess.successQuery(true, "Office added in seating_lucid_agency"));
});

router.post('/AddOfficeEmployee',function(req, res, next) {
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
            res.json(apiError.queryError("503", err.toString(), data));
          } else {
            queries.getUser(dbconnect, {email: data.email}, function(err, results) {
              if (err) {
                res.json(apiError.queryError("503", err.toString(), data));
              } else {
                var employeeID = results[0].employeeID;
                var adder = {
                  employeeKey: employeeID,
                  officeKey : officeID
                };
                queries.addEmployeeToOffice(dbconnect, adder);
              }
            });
          }
        });
      });
    });
  });
res.json(apiSuccess.successQuery(true, "Employee added to office in seating_lucid_agency"));
});

router.post('/AddTeammatesToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var adder = [];
      var employeeID = data.employeeID;

      for (var item in data.teammates) {
        adder.push(item.employeeID);
      }
      for (var i in adder) {
          queries.addTeammate(dbconnect, {idemployee_teammates: employeeID, employee_teammate_id: adder[i]});
      }
    }
  });
  res.json(apiSuccess.successQuery(true, "Teammates added to employee in seating_lucid_agency"));
});

router.post('/AddTemperatureRange',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var temperatureRange = {
        lower : data.lower,
        upper : data.upper
      };
      queries.addRange(dbconnect, temperatureRange);
    }
  });
  res.json(apiSuccess.successQuery(true, "Temperature range added in seating_lucid_agency"));
});

router.post('/AddTemperatureRangeToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var adder = {
        employeeID : data.employeeID,
        rangeID : data.temperatureRangeID
      };
      queries.addRangeToEmployee(dbconnect, adder);
    }
  });
  res.json(apiSuccess.successQuery(true, "Temperature range added to employee in seating_lucid_agency"));
});

// Routing for the Delete queries
router.get('/DeleteCompany/:id', function(req, res) {
  var ID = req.params.id;

  queries.getAllOfficesForOneCompany(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Deleting Company: ", ID);
      for (var item in data) {
        queries.getAllEmployeesForOneOfficeConfidential(dbconnect, data[item].officeID, function(err, result) {
          if (err) {
            res.json(apiError.queryError("503", err.toString(), data));
          } else if (env.logQueries) {
            console.log("Delete office: ", data[item].officeID);
            for (var i in result) {
              if (result[i].permissionLevel != 'superadmin') {
                queries.deleteEmployee(dbconnect, result[i].employeeID);
              }
            }
            queries.deleteOffice(dbconnect, ID);
          } else {
            for (var i in result) {
              if (result[i].permissionLevel != 'superadmin') {
                queries.deleteEmployee(dbconnect, result[i].employeeID);
              }
            }
            queries.deleteOffice(dbconnect, ID);
          }
        });
      }
      queries.deleteCompany(dbconnect, ID);
    } else {
      for (var item in data) {
        queries.getAllEmployeesForOneOfficeConfidential(dbconnect, data[item].officeID, function(err, result) {
          if (err) {
            res.json(apiError.queryError("503", err.toString(), data));
          } else if (env.logQueries) {
            for (var i in result) {
              if (result[i].permissionLevel != 'superadmin') {
                queries.deleteEmployee(dbconnect, result[i].employeeID);
              }
            }
            queries.deleteOffice(dbconnect, ID);
          } else {
            for (var i in result) {
              if (result[i].permissionLevel != 'superadmin') {
                queries.deleteEmployee(dbconnect, result[i].employeeID);
              }
            }
            queries.deleteOffice(dbconnect, ID);
          }
        });
      }
      queries.deleteCompany(dbconnect, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Company deleted in seating_lucid_agency"));
});

router.get('/DeleteEmployee/:id', function(req, res) {
  var ID = req.params.id;

  queries.deleteEmployee(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Employee deleted in seating_lucid_agency"));
});

router.get('/DeleteOffice/:id', function(req, res) {
  var ID = req.params.id;

  queries.getAllEmployeesForOneOfficeConfidential(dbconnect, ID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Delete office: ", ID);
      for (var item in data) {
        if (data[item].permissionLevel != 'superadmin') {
          queries.deleteEmployee(dbconnect, data[item].employeeID);
        }
      }
      queries.deleteOffice(dbconnect, ID);
    } else {
      for (var item in data) {
        if (data[item].permissionLevel != 'superadmin') {
          queries.deleteEmployee(dbconnect, data[item].employeeID);
        }
      }
      queries.deleteOffice(dbconnect, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Office deleted in seating_lucid_agency"));
});

router.get('/DeleteEntireBlackListForEmployee/:id', function(req, res) {
  var ID = req.params.id;

  queries.deleteEntireBlackListForEmploye(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Blacklist deleted in seating_lucid_agency for employee " + ID));
});

router.get('/DeleteEntireWhiteListForEmployee/:id', function(req, res) {
  var ID = req.params.id;

  queries.deleteEntireWhiteListForEmploye(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Whitelist deleted in seating_lucid_agency for employee " + ID));
});

router.get('/DeleteTemperatureRange/:id', function(req, res) {
  var ID = req.params.id;

  queries.deleteRange(dbconnect, ID);
  res.json(apiSuccess.successQuery(true, "Temperature Range deleted in seating_lucid_agency"));
});

/**************** Edit Queries ****************/
router.post('/EditCompany/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var company = {
        companyName : data.companyName
      };
      queries.editCompany(dbconnect, company, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Company edited in seating_lucid_agency"));
});

router.post('/UpdateCoworkers/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var whitelist = data.whitelist;
  var blacklist = data.blacklist;
  var employee = null;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      queries.deleteEntireBlackListForEmployee(dbconnect, ID);
      queries.deleteEntireWhiteListForEmployee(dbconnect, ID);
      for (employee in blacklist) {
        queries.addToBlackList(dbconnect, {idemployee_blacklist: ID, employee_blacklist_teammate_id: blacklist[employee].employeeID});
      }
      for (employee in whitelist) {
        queries.addToWhiteList(dbconnect, {idemployee_whitelist: ID, employee_whitelist_teammate_id: whitelist[employee].employeeID});
      }
    }
  });
  res.json(apiSuccess.successQuery(true, "Employee coworkers updated in seating_lucid_agency"));
});

router.post('/EditEmployee/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(data.password, salt, function(err, hash) {
      req.getConnection(function(err, connection) {
        if (err) {
          res.json(apiError.queryError("503", err.toString(), data));
        } else {
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
            permissionLevel : data.permissionLevel,
            haveUpdated : 1,
            accountUpdated: moment().format('YYYY-MM-DD hh:mm:ss')
          };
          queries.editEmployee(dbconnect, employee, ID);
        }
      });
    });
  });
  res.json(apiSuccess.successQuery(true, "Employee edited in seating_lucid_agency"));
});

router.post('/EditEmployeeUpdatedForOffice/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var office = {
        employeeUpdated: data.employeeUpdated
      };
      queries.editEmployeeUpdatedForOffice(dbconnect, office, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Employee edited for office in seating_lucid_agency"));
});

router.post('/EditOffice/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
    }
  });
  res.json(apiSuccess.successQuery(true, "Office edited in seating_lucid_agency"));
});

router.post('/EditEmployeePreferences/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var temperatureRangeID = data.temperatureRangeID
  var employee = {
    restroomUsage : data.restroomUsage,
    noisePreference : data.noisePreference,
    outOfDesk : data.outOfDesk,
    haveUpdated : 1,
    accountUpdated: moment().format('YYYY-MM-DD hh:mm:ss')
  };

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      queries.editEmployee(dbconnect, employee, ID);
      queries.editRangeToEmployee(dbconnect, {employeeID: ID, rangeID: temperatureRangeID}, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Employee preferences updated in seating_lucid_agency"));
});

router.post('/EditEmployeeTeammates/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var teammates = data.teammates;
  var employee = null;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      queries.deleteAllTeammatesForEmployee(dbconnect, ID);
      for (employee in teammates) {
        queries.addTeammate(dbconnect, {idemployee_teammates: ID, employee_teammate_id: teammates[employee].employeeID});
      }
    }
  });
  res.json(apiSuccess.successQuery(true, "Employee teammates updated in seating_lucid_agency"));
});


router.post('/EditTemperatureRange/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else {
      var temperatureRange = {
        lower : data.lower,
        upper : data.upper
      };
      queries.editRange(dbconnect, temperatureRange, ID);
    }
  });
  res.json(apiSuccess.successQuery(true, "Temperature range edited in seating_lucid_agency"));
});

/**************** Get Queries ****************/
router.get('/AllBlacklistEmployees',function(req, res, next) {
  queries.getAllBlacklistEmployees(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllFloorPlans',function(req, res, next) {
  queries.getAllFloorPlans(dbconnect, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of offices : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesExcept/:id',function(req, res, next) {
  queries.getAllEmployeesExceptOne(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("The list of employees and their whitelists : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Company/:id',function(req, res, next) {
  queries.getOneCompany(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyOffices/:id',function(req, res, next) {
  queries.getAllOfficesForOneCompany(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + " offices: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyForOffice/:id',function(req, res, next) {
  queries.getCompanyForOneOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Cluster/:id',function(req, res, next) {
  queries.getOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterDesks/:id',function(req, res, next) {
  queries.getAllDesksForOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s desks: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterTemperatureRange/:id',function(req, res, next) {
  queries.getTempRangeOfOneCluster(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Desk/:id',function(req, res, next) {
  queries.getOneDesk(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Desk #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Employee/:id',function(req, res, next) {
  queries.getOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeConfidential/:id',function(req, res, next) {
  queries.getOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackList/:id',function(req, res, next) {
  queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackListConfidential/:id',function(req, res, next) {
  queries.getAllBlacklistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeDesk/:id',function(req, res, next) {
  queries.getDeskOfEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office " + req.params.id + "'s employees: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammates/:id',function(req, res, next) {
  queries.getAllTeammatesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammatesConfidential/:id',function(req, res, next) {
  queries.getAllTeammatesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesNotInTeammates/:employeeID/:officeID',function(req, res, next) {
  queries.getAllEmployeesNotInTeammatesForOffice(dbconnect, req.params.employeeID, req.params.officeID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("All employees not in teammates of #" + req.params.emloyeeID + ": ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTemperatureRange/:id',function(req, res, next) {
  queries.getTempRangeOfOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesUpdatedForOffice/:id',function(req, res, next) {
  queries.getEmployeeUpdatedForOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office " + req.params.id + "'s employee updated: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteList/:id',function(req, res, next) {
  queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesNotInWhiteListOrBlackList/:employeeID/:officeID',function(req, res, next) {
  queries.getAllEmployeesNotInWhiteListOrBlackListForOffice(dbconnect, req.params.employeeID, req.params.officeID, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("All employees not in whitelist or blacklist of #" + req.params.emloyeeID + ": ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteListConfidential/:id',function(req, res, next) {
  queries.getAllWhitelistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Floorplan/:id',function(req, res, next) {
  queries.getOneFloorPlan(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorplanClusters/:id',function(req, res, next) {
  queries.getAllClustersOfOneFloorplan(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorPlanOfOffice/:id',function(req, res, next) {
  queries.getFloorPlanOfOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan of Office" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Office/:id',function(req, res, next) {
  queries.getOneOffice(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/OfficeOfEmployee/:id',function(req, res, next) {
  queries.getOfficeOfEmployee(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Office # for Employee " + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/TemperatureRange/:id',function(req, res, next) {
  queries.getOneTempRange(dbconnect, req.params.id, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/User/:id',function(req, res, next) {
  queries.getUser(dbconnect, { email : req.params.id }, function(err, data) {
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
    } else if (env.logQueries) {
      console.log("User data: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.post('/UpdatePassword',function(req, res) {
  var passwords = JSON.parse(JSON.stringify(req.body));

  queries.getOneEmployeeConfidential(dbconnect, passwords.employeeID, function(err, data) {
    var query = JSON.parse(JSON.stringify(data));
    if (err) {
      res.json(apiError.queryError("503", err.toString(), data));
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

router.post('/PasswordReset', function(req, res) {
  var user = JSON.parse(JSON.stringify(req.body));
  var newPassword = Math.round((Math.pow(36, 8) - Math.random() * Math.pow(36, 7))).toString(36).slice(1);
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");

  queries.getUser(dbconnect, user, function(err, data) {
    console.log(data);
    if (data.length>0) {
      //user was found, time to encrypt the password
      var salt = bcrypt.genSaltSync(10);
      //var hash = bcrypt.hashSync(values[data].password, salt);
      hash = bcrypt.hashSync(newPassword, salt);
      //update the user's password
      queries.getOneEmployeeConfidential(dbconnect, data[0].employeeID, function(err, data) {
        var query = JSON.parse(JSON.stringify(data));
        console.log(data);
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

        queries.editEmployee(dbconnect, employee, query[0].employeeID);
      });
      //now send the email to the user
      client.sendEmail({
          "From": "djgraca@asu.edu",
          "To": user.email,
          "Subject": 'You have requested a Password Reset',
          "TextBody": "Please use this temporary password to login: "+newPassword
      });
      res.send("Password Reset");
    }
    else {
      console.log("4");
      res.json({ success: false, message: 'No such user.' });
    }
  });
});

/**************** E-mail API ****************/
router.post('/SendEmail',function(req, res, next) {
  var emailData = JSON.parse(JSON.stringify(req.body));
  //Admin Reasons: Password update, password reset request, employee preferences changed (daily)
  //User Reasons: When added to update profile, then 5 days later remind them, after that every 10 days, then suggest update every 92 days
  // Example request
  var postmark = require("postmark");
  var client = new postmark.Client("9dfd669c-5911-4411-991b-5dbebb620c88");
  if (emailData.reason ==='passwordUpdate') {
    queries.emailSuperAdmins(dbconnect, function(err, data) {
      if (err) {
        res.json(apiError.queryError("503", err.toString(), data));
      } else if (env.logQueries) {
        //console.log("The list of employees : ", data);
        email=data;
      } else {
        admin=JSON.parse(JSON.stringify(data));
        for (var i in admin) {
          val = admin[i];
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": 'Someone has Updated their Password',
            "TextBody": emailData.email+" has updated their password."
          });
        }
      }
    });
  } else if (emailData.reason ==='passwordReset') {
    queries.emailSuperAdmins(dbconnect, function(err, data) {
      if (err) {
        res.json(apiError.queryError("503", err.toString(), data));
      } else if (env.logQueries) {
        //console.log("The list of employees : ", data);
        email=data;
      } else {
        admin=JSON.parse(JSON.stringify(data));
        for (var i in admin) {
          val = admin[i];
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": 'Someone has Requested a Password Reset',
            "TextBody": emailData.email+" has requested a password reset and has been given a temporary password."
          });
        }
      }
    });
  } else if (emailData.reason ==='employeeUpdate') {
    queries.emailSuperAdmins(dbconnect, function(err, data) {
      if (err) {
        res.json(apiError.queryError("503", err.toString(), data));
      } else if (env.logQueries) {
        //console.log("The list of employees : ", data);
        email=data;
      } else {
        admin=JSON.parse(JSON.stringify(data));
        for (var i in admin) {
          val = admin[i];
          //console.log(val.email);
          client.sendEmail({
            "From": "djgraca@asu.edu",
            "To": val.email,
            "Subject": 'Seating Chart Update Recommended',
            "TextBody": "Employee(s) have updated their preferences and the Seating Chart recommendation may have changed."
          });
        }
      }
    });
  } else if (emailData.reason ==='employeeAdd') {
    //console.log("got here");
    //console.log(emailData.to);
    client.sendEmail({
        "From": "djgraca@asu.edu",
        "To": emailData.to,
        "Subject": 'Welcome to DeskSeeker!',
        "TextBody": "Welcome to DeskSeeker!  Please login and update your preferences now to get the perfect desk for you!  Your password is :  "+emailData.password
    });
  }
  //console.log("finished");
res.send("Email sent");
});

module.exports = router;
