const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');

const DbTp = promiseDb.makePoolDb(dbUsersPool);

module.exports = {
  findAll(dbName) {
    const sql = 'SELECT * FROM ' + dbName + '.log ;';
    console.log('sql', sql);

    return DbTp(sql, []);
  },
};
