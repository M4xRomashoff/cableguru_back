const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  addLogData(logData) {
    const dbTableName = logData[1] + '.log';
    const sqlString = 'INSERT INTO ' + dbTableName + ' (user_id, item, action, comments) VALUES (?)';
    const logDataPrepared = [logData[0], logData[2], logData[3], logData[4]];
    return DataBases(sqlString, [logDataPrepared]);
  },
  getLogData(dbName) {
    const dbTableName = dbName + '.log';
    return DataBases('SELECT * FROM ?', dbTableName);
  },
};
