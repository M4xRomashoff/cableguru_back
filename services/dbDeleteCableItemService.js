const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  deleteCableItem(data) {
    const dbTableName = data.dbName + '.cable';
    const sqlString = 'DELETE FROM ' + dbTableName + ' WHERE id = ' + data.cableId.toString();
    return DataBases(sqlString, []);
  },
};
