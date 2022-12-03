const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  addSpItem(Data) {
    const dbTableName = Data[1] + '.sp';
    const sqlString = 'INSERT INTO ' + dbTableName + ' (current_status, name_id, mfg, model, capacity, spl_type, mount, address, latitude, longitude, owner) VALUES (?)';
    const DataPrepared = [Data[2], Data[3], Data[4], Data[5], Data[6], Data[7], Data[8], Data[9], Data[10], Data[11], Data[12]];
    return DataBases(sqlString, [DataPrepared]);
  },
  createSpTable(Data, result) {
    const newTableName = 'sp_' + result.insertId.toString();
    const sqlString1 = 'USE ' + Data[1];
    const res1 = DataBases(sqlString1, []);
    const sqlString = 'CREATE TABLE ' + newTableName + ' ( id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT );';
    return DataBases(sqlString, []);
  },
};
