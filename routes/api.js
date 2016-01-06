var express = require('express');
var router = express.Router();
var env = require('../env');

/**************** Database Connection ****************/
var queries = require('../database/queries');
var password = ''
var dbconnect = queries.getConnection(password);
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
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of employees and their blacklists : ", data);
      res.json(data);
    }
  });
});

router.get('/AllClusters',function(req, res, next) {
  queries.getAllClusters(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of clusters : ", data);
      res.json(data);
    }
  });
});

router.get('/AllClustersOfFloorplans',function(req, res, next) {
  queries.getAllClustersOfFloorplans(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of clusters of the floor plans : ", data);
      res.json(data);
    }
  });
});

router.get('/AllDesks',function(req, res, next) {
  queries.getAllDesks(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of desks : ", data);
      res.json(data);
    }
  });
});

router.get('/AllDesksWithEmployees',function(req, res, next) {
  queries.getAllDesksWithEmployees(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of desks with employees : ", data);
      res.json(data);
    }
  });
});

router.get('/AllEmployees',function(req, res, next) {
  queries.getAllEmployees(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of employees : ", data);
      res.json(data);
    }
  });
});

router.get('/AllTeammates',function(req, res, next) {
  queries.getAllTeammates(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of employees with their teammates : ", data);
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfClusters',function(req, res, next) {
  queries.getAllTempRangesOfClusters(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of temperature ranges of each cluster : ", data);
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfEmployees',function(req, res, next) {
  queries.getAllTempRangesOfEmployees(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of temperature ranges of each employee : ", data);
      res.json(data);
    }
  });
});

router.get('/AllTempRangesOfFloorplans',function(req, res, next) {
  queries.getAllTempRangesOfFloorplans(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of temperature ranges of each floor plan : ", data);
      res.json(data);
    }
  });
});

router.get('/AllWhitelistEmployees',function(req, res, next) {
  queries.getAllWhitelistEmployees(dbconnect, function(err, data){
    if (err) {
      console.log("ERROR : ", err);
    } else {
      console.log("The list of employees and their whitelists : ", data);
      res.json(data);
    }
  });
});

module.exports = router;
