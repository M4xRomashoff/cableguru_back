const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');

const DbCable = promiseDb.makePoolDb(dbUsersPool);

module.exports = {
  findAll(dbName) {
    const sql = createSql(dbName, '.cable');

    return DbCable(sql);
  },
  getOneCable(dbName, cabId) {
    const sql = 'SELECT * FROM ' + dbName + '.cable WHERE id=' + cabId.toString() + ';';
    const cableData = DbCable(sql, []);
    return cableData;
  },
};
