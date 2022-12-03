const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  deleteSpItem(data) {
    const dbTableName = data.dbName + '.sp';
    const sqlString = 'DELETE FROM ' + dbTableName + ' WHERE id = ' + data.spId.toString();
    return DataBases(sqlString, []);
  },

  deleteSpItemTable(data) {
    const tableName = data.dbName + '.sp_' + data.spId.toString();
    const sql = 'DROP TABLE IF EXISTS ' + tableName;
    return DataBases(sql, []);
  },
};
