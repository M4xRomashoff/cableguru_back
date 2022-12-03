const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');

const DbTp = promiseDb.makePoolDb(dbUsersPool);

module.exports = {
  findAll(dbName) {
    const sql = createSql(dbName, '.tp');

    return DbTp(sql);
  },
  findOne(dbName, tpId) {
    const sql = 'SELECT * FROM ' + dbName + '.tp ' + 'WHERE id = ' + tpId.toString() + ';';
    const tpData = DbTp(sql, []);

    return tpData;
  },
};
