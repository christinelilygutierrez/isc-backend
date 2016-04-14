//
// Environment Config
//
//jshint esversion: 6

// The environment variable for the database

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

const env = {
  database: {
    host: 'isc.c2uhc91lzpk3.us-east-1.rds.amazonaws.com',
    name: 'seating_lucid_agency',
    user: 'iscroot',
    pass: '??Pr}AX&8dGq8>27',
    port: 3306,
    multipleStatements: true
  },
  logErrors: true,
  logQueries: false,
  key : randomString(100, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(),<.>/?;:[{}]=+-_')
};

module.exports = env;
