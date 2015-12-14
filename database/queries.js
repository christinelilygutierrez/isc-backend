// Function that returns an object that represents a connection
exports.getConnection = function(password) {
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: password,
    database:'seating_lucid_agency'
  });
  return connection;
};

exports.addCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.cluster (xcoordinate, ycoordinate) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster at coordinate (%f, %f) added to database", values[0], values[1]);
  });
};

exports.addClusterToFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.uses (floorplanKey, clusterKey) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Cluster ID %d was added to floorplan ID %d", values[1], values[0]);
  });
};

exports.addDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.desk (xcoordinate, ycoordinate, width, height) VALUES (?, ?, ?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk at coordinate (%f, %f) added to database", values[0], values[1]);
  });
};

exports.addDeskToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.composed_of (IDofCluster, IDofDesk) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Desk ID %d was assigned to cluster ID %d", values[1], values[0]);
  });
};

exports.addEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee (firstName, lastName, email, password, department, title, restroomUsage, noisePreference, outOfDesk, pictureAddress, permissionLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("%s %s was inserted into the database", values[0], values[1]);
  });
};

exports.addEmployeeToDesk = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.sits_at (IDemployee, IDdesk) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee ID %d was assigned to desk ID %d", values[0], values[1]);
  });
};

exports.addFloorPlan = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.floor_plan (height, width) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Floor planw with height of %f and width of %f was added to database", values[0], values[1]);
  });
};

exports.addRange = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.range (lower, upper) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range between %f and %f was added to database", values[0], values[1]);
  });
};

exports.addeRangeToCluster = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_cluster_temp (IDcluster, IDrange) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was added to cluster ID %d", values[1], values[0]);
  });
};

exports.addeRangeToEmployee = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.has_a_emp_temp (employeeID, rangeID) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Range ID %d was added to employee id %d", values[1], values[0]);
  });
};

exports.addTeammate = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_teammates (idemployee_teammates, employee_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added as a teammate", values[0], values[1]);
  });
};

exports.addToBlackList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_blacklist (idemployee_blacklist, employee_blacklist_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added to the black list", values[0], values[1]);
  });
};

exports.addToWhiteList = function(connection, values) {
  connection.query("INSERT INTO seating_lucid_agency.employee_whitelist (idemployee_whitelist, employee_whitelist_teammate_id) VALUES (?, ?);", values, function(err, result) {
    if (err) {
      console.log(err);
    }
    console.log("Employee id %d had employee id %d added to the white list", values[0], values[1]);
  });
};

exports.getAllEmployees = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.employee', function(err, result) {
    if(err) {
      callback(err, null);
    }
    callback(null, JSON.stringify(result));
  });
};

exports.getAllDesks = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.desk', function(err, result) {
    if(err) {
      callback(err, null);
    }
    callback(null, JSON.stringify(result));
  });
};

exports.getAllClusters = function(connection, callback) {
  connection.query('SELECT * FROM seating_lucid_agency.cluster', function(err, result) {
    if(err) {
      callback(err, null);
    }
    callback(null, JSON.stringify(result));
  })
};