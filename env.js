//
// Environment Config
//
//jshint esversion: 6

// The environment variable for the database
var bcrypt = require('bcrypt');

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(randomString(100, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(),<.>/?;:[{}]=+-_'), salt);

const env = {
  database: {
    host: 'localhost',
    name: 'seating_lucid_agency',
    user: 'root',
    pass: '',
    port: 3306,
    multipleStatements: true
  },
  logErrors: true,
  logQueries: false,
  key : hash
};

module.exports = env;
