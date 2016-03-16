//
// Environment Config
//
//jshint esversion: 6

// The environment variable for the database
const env = {
  database: {
    host: 'localhost',
    name: 'seating_lucid_agency',
    user: 'root',
    pass: 'atkawa7',
    port: 3306,
    multipleStatements: true
  },
  logErrors: true,
  logQueries: false,
};

module.exports = env;
