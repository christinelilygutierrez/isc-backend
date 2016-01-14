var express = require('express');
var router = express.Router();
var env = require('../env');

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

/* GET api page */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

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
