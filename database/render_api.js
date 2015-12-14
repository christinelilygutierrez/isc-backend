exports.addEmployee = function(req, res) {
  res.render('add_employee', {title:"Add an Employee"});
};

exports.confirmEditEmployee = function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
    var employee = {
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      password : data.password,
      department : data.department,
      title : data.title,
      restroomUsage : data.restroomUsage,
      noisePreference : data.noisePreference,
      outOfDesk : data.outOfDesk,
      pictureAddress : data.pictureAddress,
      permissionLevel : data.permissionLevel
    };

    connection.query('UPDATE employee SET ? WHERE employeeID = ?', [employee, ID], function(err, result) {
      if(err) {
        console.log("Error Updating : %s ", err);
      }
      res.redirect('/employees');
    });
  });
};

exports.confirmEmployee = function(req, res) {
  var data = JSON.parse(JSON.stringify(req.body));

  req.getConnection(function(err, connection) {
    var employee = {
      firstName : data.firstName,
      lastName : data.lastName,
      email : data.email,
      password : data.password,
      department : data.department,
      title : data.title,
      restroomUsage : data.restroomUsage,
      noisePreference : data.noisePreference,
      outOfDesk : data.outOfDesk,
      pictureAddress : data.pictureAddress,
      permissionLevel : data.permissionLevel
    };

    connection.query('INSERT INTO employee SET ?', employee, function(err, result) {
      if(err) {
        console.log("Error Inserting : %s ", err);
      }
      res.redirect('/employees');
    });
  });
};

exports.deleteEmployee = function(req, res) {
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
      connection.query('DELETE FROM employee WHERE employeeID = ?', [ID], function(err, result) {
        if(err) {
          console.log("Error Deleting : %s ", err);
        }
        res.redirect('/employees');
      });
    });
};

exports.editEmployee = function(req, res) {
  var ID = req.params.id;

  req.getConnection(function(err, connection) {
      connection.query('SELECT * FROM employee WHERE employeeID = ?', [ID], function(err, result) {
        if(err) {
          console.log("Error Selecting : %s ", err);
        }
        res.render('edit_employee', {title:"Edit an Employee", employees:result});
      });
    });
};

exports.getAllEmployees = function(req, res) {
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM employee', function(err, result) {
      if(err) {
        console.log("Error Selecting : %s ", err);
      }
      res.render('employees', {title:"List of Employees", employees:result});
    });
  });
};

exports.getAllDesks = function(req, res) {
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM desk', function(err, result) {
      if(err) {
        console.log("Error Selecting : %s ", err);
      }
      res.render('desks', {title:"List of Desks", desks:result});
    });
  });
};

exports.getAllClusters = function(req, res) {
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM cluster', function(err, result) {
      if(err) {
        console.log("Error Selecting : %s ", err);
      }
      res.render('clusters', {title:"List of Clusters", clusters:result});
    });
  });
};