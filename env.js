//
// Environment Config
//
//jshint esversion: 6

// The environment variable for the database
const env = {
  database: {
    host: '192.168.99.100',
    name: 'seating_lucid_agency',
    user: 'root',
    pass: 'admin',
    port: 3306
  },
  logErrors: true,
  logQueries: false,
};

module.exports = env;
