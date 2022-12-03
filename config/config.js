module.exports = {
  host: process.env.HOST,

  // JWT
  jwtSecret: process.env.JWT_SECRET,

  dbUsers: {
    host: 'localhost',
    user: 'root',
    password: 'Twenty22!',
    database: 'users',
  },

  dbSample1: {
    host: 'localhost',
    user: 'root',
    password: 'Twenty22!',
    database: 'sample1',
  },
  dbList: {
    host: 'localhost',
    user: 'root',
    password: 'Twenty22!',
  },

  dbNoDbSelected: {
    host: 'localhost',
    user: 'root',
    password: 'Twenty22!',
  },

  dbUsersPool: {
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'Twenty22!',
    database: 'users',
  },
};
