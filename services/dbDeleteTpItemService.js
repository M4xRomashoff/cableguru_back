const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  deleteTpItem(data) {
    const dbTableName = data.dbName + '.tp';
    const sqlString = 'DELETE FROM ' + dbTableName + ' WHERE id = ' + data.tpId.toString();
    return DataBases(sqlString, []);
  },

  deleteTpItemTable(data) {
    const tableName = data.dbName + '.tp_' + data.tpId.toString();
    const sql = 'DROP TABLE IF EXISTS ' + tableName;
    return DataBases(sql, []);
  },
};
