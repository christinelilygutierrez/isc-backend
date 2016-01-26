var express = require('express');
var router = express.Router();
var env = require('../env');
var hasher = require('password-hash');

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

// GET /api page
router.get('/', function(req, res, next) {
  res.redirect('/');
});


// Routing for the Add queries
router.post('/AddCluster',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var cluster = {
      xcoordinate : data.xcoordinate,
      ycoordinate : data.ycoordinate
    };
    queries.addCluster(dbconnect, cluster);
  });
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
});

router.post('/AddEmployee',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var employee = {
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      password : hasher.generate(data.password),
      department : data.department,
      title : data.title,
      restroomUsage : data.restroomUsage,
      noisePreference : data.noisePreference,
      outOfDesk : data.outOfDesk,
      pictureAddress : data.pictureAddress,
      permissionLevel : data.permissionLevel
    };
    queries.addEmployee(dbconnect, employee);
  });
});

router.post('/AddOffice',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var office = {
      companyName: data.companyName,
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
});

//Routing for the Delete queries
router.get('/DeleteEmployee/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteEmployee(dbconnect, ID);
});

router.get('/DeleteOffice/:id', function(req, res) {
  var ID = req.params.id;
  queries.deleteOffice(dbconnect, ID);
});

// Routing for the Edit queries
router.post('/EditEmployee/:id', function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    var employee = {
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      password : hasher.generate(data.password),
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

router.post('/EditOffice/:id',function(req, res, next) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    var office = {
      companyName: data.companyName,
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

module.exports = router;
