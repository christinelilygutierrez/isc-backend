//
// Environment Config
//
//

// The environment variable for the database
const env = {
  database: {
    host: 'localhost',
    name: 'seating_lucid_agency',
    user: 'root',
    pass: '',
    port: 3306
  },
  logErrors: true,
  logQueries: false,
};

module.exports = env;