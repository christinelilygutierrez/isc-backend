var uuid = require('node-uuid');
var env = require('../env/env');
exports.getConnection=function(){
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host : env.database.host,
    user:  env.database.user,
    password: env.database.password,
    database: env.database.name
  });
  return connection;
};
exports.addUser=function(connection){
  connection.query("select * from employees",  function(err, rows, fields){
    if(err) throw err;
    else console.log(rows);
  });
};
exports.seedUsers=function(connection){
  var a={
    'username': 'a',
    'password': 'pass',
    'uuid': uuid.v4()
  };
  var b={
    'username': 'b',
    'password': 'pass',
    'uuid': uuid.v4()
  };
  connection.query("insert into employees(uuid, username, password) values(?, ?, ?)", [
    a['uuid'],
    a['username'],
    a['password']
  ]);
  connection.query("insert into employees(uuid, username, password) values(?, ?, ?)", [
    b['uuid'],
    b['username'],
    b['password']
  ]);
};

exports.getUser=function(connection, user, callback){
  connection.query("select * from employees where username=?", [user.username], function(err,rows){
    if(err) {
       callback(err, null);
     } else {
       callback(null, (rows));
     }
  });
};

exports.getUsers=function(connection, callback){
  connection.query("select * from employees;", function(err, rows){
    if(err){
      callback(err, null);
    }
    else{
      callback(null, (rows));
    }
  });
};

exports.saveUser=function(connection, user, callback){
  var u= user.username;
  var p= user.password;
  connection.query("insert into employees(uuid, username, password) values(?, ?, ?)",[uuid.v4(), u, p],function(err){
    if(err){
      callback(err);
    }
    else{
      callback(null);
    }
  });
};
