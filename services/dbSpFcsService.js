const promiseDb = require('../utils/promiseDb');
const { dbNoDbSelected } = require('../config/config');
const { createSqlFcsConnectionsSp, createSqlFcsCables, createSqlFcs } = require('../utils/createSql');

const DbSp = promiseDb.makePoolDb(dbNoDbSelected);

module.exports = {
  getConnections(dbName, spId) {
    const sql = createSqlFcsConnectionsSp(dbName, '.connections', spId);

    return DbSp(sql);
  },
  getCables(dbName, cablesId) {
    const sql = createSqlFcsCables(dbName, '.cable', cablesId);

    return DbSp(sql);
  },
  getSp(dbName, spId) {
    const sql = createSqlFcs(dbName, spId);
    return DbSp(sql);
  },
};
