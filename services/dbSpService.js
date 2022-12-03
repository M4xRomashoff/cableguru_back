const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');

const DbSp = promiseDb.makePoolDb(dbUsersPool);

module.exports = {
  async findAll(dbName) {
    const sql = createSql(dbName, '.sp');
    return DbSp(sql, []);
  },

  async findFew(_dbName, spList) {
    const dbName = _dbName + '.sp';
    let spData = [];
    const sql = 'SELECT * FROM ' + dbName + ' WHERE id in (' + spList + ')';
    spData = DbSp(sql, []);
    return spData;
  },
};
