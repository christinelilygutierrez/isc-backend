var express = require('express');
var router = express.Router();
var env = require('../env');
var jwt    = require('jsonwebtoken');
var apiError = require('../database/api_errors');
var uuid = require('node-uuid');
var moment = require('moment');
var bcrypt = require('bcrypt');
var csvParser = require('csv-parse');
var fs = require('fs');

/**************** Database Connection ****************/
var queries = require('../database/queries');
var dbconnect = queries.getConnection();
dbconnect.connect(function(err){
  if(!err) {
    console.log("Connected to seating_lucid_agency");
  } else if (env.logErrors) {
    console.log("Error connecting database", err);
  } else {
    console.log("Error connecting database");
  }
});

var multer  = require('multer');
// File Upload
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/documents')
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

router.post('/Upload/Image', upload.single('image'), function (req, res, next) {
  var file = req.file;

  console.log("success");
  //console.log(req.file);
  console.log(file.filename);
  res.status(204).end();
});

router.post('/Upload/Csv', upload.single('csv'), function (req, res, next) {
  //console.log("success");
  //console.log(req.file);
  var file = req.file;
  var rs = fs.createReadStream(file.path);
  parser = csvParser({columns: true}, function(err, employees){
    var values=[];
    for( var i in employees){
      //gets the employee
      employee= JSON.parse(JSON.stringify(employees[i]));
      //converts json to array
      var arr = Object.keys(employee).map(function(k) { return employee[k]});
      values.push(arr);
    }
    queries.bulkInsert(dbconnect, values);
});
rs.pipe(parser);
//console.log(file.filename);
res.status(204).end();
});

/**************** Login Implementationn ****************/

// Create a token if an employee signs in
router.post('/Authenticate', function(req, res){
  var employee = null;
  var u;
  var p;
  var dbUser;
  var token;

  try {
     employee = JSON.parse(JSON.stringify(req.body));
  } catch (e) {
    res.json(apiError.errors("401","problems parsing json"));
  }
  u = employee.email;
  p = employee.password;
  if ( u === undefined || u === null || p === undefined || p === null) {
    res.json(apiError.errors("401", "Missing parameters"));
  } else {
    queries.getUser(dbconnect, employee, function(err, rows){
      if (!err) {
        if (rows.length < 1) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else {
            dbUser = JSON.parse(JSON.stringify(rows[0]));
            if (dbUser.email === u && bcrypt.compareSync(p, dbUser.password)) {
              employee.password = dbUser.password;
              token = jwt.sign(employee, "test", {
                  expiresIn: moment().add(1, 'days').valueOf() // expires in 24 hours
              });
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
            } else{
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            }
        }
      } else{
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
    });
  }
});

// Mark for deletion since it is redundant
/*router.post('/register', function(req, res){
  console.log(req.body);
  var user = null;
  try {
    user = JSON.parse(JSON.stringify(req.body));
  } catch (e) {
    res.json(apiError.errors("401","problems parsing json"));
  }
  var u = user.username;
  var p = user.password;
  if(u === undefined|| u === null || p === undefined || p === null) {
    res.json(apiError.errors("401", "Missing parameters"));
  } else{
    queries.saveUser(dbconnect, user, function(err){
      if(err){
        res.json({ success: false, message: 'Registration failed' });
      } else{
        res.json({ success: true, message: 'Sucessfuly registered user '+ user.username.toString()});
      }
    })
  }
});*/

// Verify the token and decode
router.get('/Verify/', function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
   // decode token
   if (token) {
     // verifies secret and checks exp
     jwt.verify(token, 'test', function(err, decoded) {
       if (err) {
         res.json({ success: false, message: 'Failed to authenticate token.' });
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
     return res.status(403).send({
         success: false,
         message: 'No token provided.'
     });
   }
});

// Prevents access to page unless token is present
/*router.use(function(req, res, next){
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

/*// Mark for deletion since unimplemented
router.get('/seed', function(req, res){
  queries.seedUsers(dbconnect);
  res.render("seed");
});

// Mark for deletion since unimplemented
router.get('/users', function(req, res){
  var users=[];
  queries.getUsers(dbconnect, function(err, rows){
    if(!err){
      res.json(rows);
    }
    else{
      res.json(users);
    }
  });
});*/

router.get('/Authenticate', function(req, res){
  res.json(apiError.errors("403","denied"));
});

/**************** RESTful API ****************/
// GET /api page
router.get('/', function(req, res, next) {
  res.redirect('/');
});

// Routing for the Add queries
router.post('/AddCompany',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var company = {
      companyName : data.companyName
    };
    queries.addCompany(dbconnect, company);
  });
  res.send("Company Added.");
});


router.post('/AddCluster',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var cluster = {
      xcoordinate : data.xcoordinate,
      ycoordinate : data.ycoordinate
    };
    queries.addCluster(dbconnect, cluster);
  });
  res.send("Cluster Added.");
});

router.post('/AddDesk',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var desk = {
      xcoordinate : data.xcoordinate,
      ycoordinate : data.ycoordinate,
      width : data.width,
      height : data.height
    };
    queries.addDesk(dbconnect, desk);
  });
  res.send("Desk Added.");
});

router.post('/AddEmployee',function(req, res, next) {
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
        queries.addEmployee(dbconnect, employee, function (err) {
          if (err) {
            return res.json({error: err});
          } else {
            queries.getUser(dbconnect, {email: data.email}, function(err, results) {
              if (err && env.logErrors) {
                console.log("ERROR : ", err);
              } else {
                //console.log("User: ");
                //console.log(results[0]);
                var employeeID = results[0].employeeID;
                //console.log("Original Data");
                //console.log(data);

                queries.addRangeToEmployee(dbconnect, {employeeID: employeeID, rangeID: data.temperatureRangeID});
                for (var item in data.teammates) {
                  queries.addTeammate(dbconnect, {idemployee_teammates: employeeID, employee_teammate_id: data.teammates[item].employeeID});
                }
                for (var item in data.blacklist) {
                  queries.addToBlackList(dbconnect, {idemployee_blacklist: employeeID, employee_blacklist_teammate_id: data.blacklist[item].employeeID});
                }
                for (var item in data.whitelist) {
                  queries.addToWhiteList(dbconnect, {idemployee_whitelist: employeeID, employee_whitelist_teammate_id: data.whitelist[item].employeeID});
                }
              }
            });
          }
        });
      });
    });
  });
  res.send("Employee added.");
});

router.post('/AddEmployees',function(req, res, next) {
  var values = JSON.parse(JSON.stringify(req.body));
  var values = values.employees;
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
    queries.addEmployee(dbconnect, employee, function (err) {
    });
  }
  return res.send("Employees added.");
});

router.post('/AddOffice',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var office = {
      officeName: data.officeName,
      officePhoneNumber: data.officePhoneNumber,
      officeEmail: data.officeEmail,
      officeStreetAddress: data.officeStreetAddress,
      officeCity: data.officeCity,
      officeState: data.officeState,
      officeZipcode: data.officeZipcode
    };
    queries.addOffice(dbconnect, office);
  });
  res.send("Office added.");
});

router.post('/AddTeammatesToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var adder = [];
    var employeeID = data.employeeID;

    for (var item in data.teammates) {
      adder.push(item.employeeID);
    }
    for (var i in adder) {
        queries.addTeammate(dbconnect, {idemployee_teammates: employeeID, employee_teammate_id: adder[i]});
    }
  });
  res.send("Teammates added to an employee.");
});

router.post('/AddTemperatureRangeToEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var adder = {
      employeeID : data.employeeID,
      rangeID : data.temperatureRangeID
    };
    queries.addRangeToEmployee(dbconnect, adder);
  });
  res.send("Temperature range added to an employee.");
});


//Routing for the Delete queries
router.get('/DeleteCompany/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteCompany(dbconnect, ID);
  res.send("Company deleted.");
});

router.get('/DeleteEmployee/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteEmployee(dbconnect, ID);
  res.send("Employee deleted.");
});

router.get('/DeleteOffice/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteOffice(dbconnect, ID);
  res.send("Office deleted.");
});

router.get('/deleteEntireBlackListForEmployee/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteEntireBlackListForEmploye(dbconnect, ID);
  res.send("Blacklist for employee %d deleted.", ID);
});

router.get('/deleteEntireWhiteListForEmployee/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteEntireWhiteListForEmploye(dbconnect, ID);
  res.send("Whitelist for employee %d deleted.", ID);
});

// Routing for the Edit queries
router.post('/EditCompany/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    var company = {
      companyName : data.companyName
    };
    queries.editCompany(dbconnect, company, ID);
  });
  res.send("Company edited");
});

router.post('/UpdateCoworkers/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;
  var whitelist = data.whitelist;
  var blacklist = data.blacklist;
  var employee = null;

  req.getConnection(function(err, connection) {
    queries.deleteEntireBlackListForEmployee(dbconnect, ID);
    queries.deleteEntireWhiteListForEmployee(dbconnect, ID);
    for (employee in blacklist) {
      queries.addToBlackList(dbconnect, {idemployee_blacklist: ID, employee_blacklist_teammate_id: blacklist[employee].employeeID});
    }
    for (employee in whitelist) {
      queries.addToWhiteList(dbconnect, {idemployee_whitelist: ID, employee_whitelist_teammate_id: whitelist[employee].employeeID});
    }
  });
  res.send("Coworkers Updated;");
});

router.post('/EditEmployee/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

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
        queries.editEmployee(dbconnect, employee, ID);
      });
    });
  });
  res.send("Employee edited");
});

router.post('/EditOffice/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
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
  });
  res.send("Ofice edited");
});

// Routing for the Get queries
router.get('/AllBlacklistEmployees',function(req, res, next) {
  queries.getAllBlacklistEmployees(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees and their blacklists : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllCompanies',function(req, res, next) {
  queries.getAllCompanies(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if(env.logQueries) {
      console.log("The list of companies : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllCompaniesForAllOffices',function(req, res, next) {
  queries.getCompaniesForAllOffices(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if(env.logQueries) {
      console.log("The list of companies : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllClusters',function(req, res, next) {
  queries.getAllClusters(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if(env.logQueries) {
      console.log("The list of clusters : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllClustersOfFloorplans',function(req, res, next) {
  queries.getAllClustersOfFloorplans(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of clusters of the floor plans : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllDesks',function(req, res, next) {
  queries.getAllDesks(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of desks : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllDesksWithEmployees',function(req, res, next) {
  queries.getAllDesksWithEmployees(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of desks with employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployees',function(req, res, next) {
  queries.getAllEmployees(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesConfidential',function(req, res, next) {
  queries.getAllEmployeesConfidential(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllFloorPlans',function(req, res, next) {
  queries.getAllFloorPlans(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of floor plans : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllOffices',function(req, res, next) {
  queries.getAllOffices(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of offices : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllEmployeesExcept/:id',function(req, res, next) {
  queries.getAllEmployeesExceptOne(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if(env.logQueries) {
      console.log("The list of employees except " + req.params.id + " : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTeammates',function(req, res, next) {
  queries.getAllTeammates(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees with their teammates : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRanges',function(req, res, next) {
  queries.getAllTempRanges(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("List of Temperature Ranges: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfClusters',function(req, res, next) {
  queries.getAllTempRangesOfClusters(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each cluster : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfEmployees',function(req, res, next) {
  queries.getAllTempRangesOfEmployees(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each employee : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfFloorplans',function(req, res, next) {
  queries.getAllTempRangesOfFloorplans(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of temperature ranges of each floor plan : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/AllWhitelistEmployees',function(req, res, next) {
  queries.getAllWhitelistEmployees(dbconnect, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("The list of employees and their whitelists : ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Company/:id',function(req, res, next) {
  queries.getOneCompany(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Company #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/CompanyForOffice/:id',function(req, res, next) {
  queries.getCompanyForOneOffice(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Cluster/:id',function(req, res, next) {
  queries.getOneCluster(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterDesks/:id',function(req, res, next) {
  queries.getAllDesksForOneCluster(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s desks: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/ClusterTemperatureRange/:id',function(req, res, next) {
  queries.getTempRangeOfOneCluster(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Cluster #" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Desk/:id',function(req, res, next) {
  queries.getOneDesk(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Desk #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Employee/:id',function(req, res, next) {
  queries.getOneEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeConfidential/:id',function(req, res, next) {
  queries.getOneEmployeeConfidential(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackList/:id',function(req, res, next) {
  queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeBlackListConfidential/:id',function(req, res, next) {
  queries.getAllBlacklistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s blacklist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
})

router.get('/EmployeeDesk/:id',function(req, res, next) {
  queries.getDeskOfEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s desk: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesOfOffice/:id',function(req, res, next) {
  queries.getAllEmployeesForOneOffice(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Office " + req.params.id + "'s employees: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammates/:id',function(req, res, next) {
  queries.getAllTeammatesForOneEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTeammatesConfidential/:id',function(req, res, next) {
  queries.getAllTeammatesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s teammates:" , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeTemperatureRange/:id',function(req, res, next) {
  queries.getTempRangeOfOneEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #'" + req.params.id + "'s temperature range: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteList/:id',function(req, res, next) {
  queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeesNotInWhiteListOrBlackList/:employeeID/:officeID',function(req, res, next) {
  queries.getAllEmployeesNotInWhiteListOrBlackListForOffice(dbconnect, req.params.employeeID, req.params.officeID, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("All employees not in whitelist or blacklist of #" + req.params.emloyeeID + ": ", data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/EmployeeWhiteListConfidential/:id',function(req, res, next) {
  queries.getAllWhitelistEmployeesForOneEmployeeConfidential(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Employee #" + req.params.id + "'s whitelist: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Floorplan/:id',function(req, res, next) {
  queries.getOneFloorPlan(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorplanClusters/:id',function(req, res, next) {
  queries.getAllClustersOfOneFloorplan(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/FloorPlanOfOffice/:id',function(req, res, next) {
  queries.getFloorPlanOfOffice(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Floorplan of Office" + req.params.id + ": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/Office/:id',function(req, res, next) {
  queries.getOneOffice(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Office #" + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/OfficeOfEmployee/:id',function(req, res, next) {
  queries.getOfficeOfEmployee(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Office # for Employee " + req.params.id +": " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/TemperatureRange/:id',function(req, res, next) {
  queries.getOneTempRange(dbconnect, req.params.id, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("Floorplan #" + req.params.id + "'s clusters: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

router.get('/User/:id',function(req, res, next) {
  queries.getUser(dbconnect, { email : req.params.id }, function(err, data){
    if (err && env.logErrors) {
      console.log("ERROR : ", err);
    } else if (env.logQueries) {
      console.log("User data: " , data);
      res.json(data);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
