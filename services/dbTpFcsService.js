const promiseDb = require('../utils/promiseDb');
const { dbNoDbSelected } = require('../config/config');
const { createSqlFcsConnectionsTp, createSqlFcsCables, createSqlFcsTp } = require('../utils/createSql');

const DbSp = promiseDb.makePoolDb(dbNoDbSelected);

module.exports = {
  getConnections(dbName, tpId) {
    const sql = createSqlFcsConnectionsTp(dbName, '.connections', tpId);

    return DbSp(sql);
  },
  getCables(dbName, cablesId) {
    const sql = createSqlFcsCables(dbName, '.cable', cablesId);

    return DbSp(sql);
  },
  getTp(dbName, tpId) {
    const sql = createSqlFcsTp(dbName, tpId);
    return DbSp(sql);
  },
};
