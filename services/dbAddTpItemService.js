const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');
const DataBases = promiseDb.makeDb(dbList);

function createDataForPorts(size) {
  let portsData = '';
  let item = '';
  for (let i = 1; i < size; i++) {
    const item = " ('port " + i.toString() + "' , 'self', 0),";
    portsData += item;
  }
  item = " ('port " + size.toString() + "' , 'self', 0);";
  portsData += item;

  return portsData;
}

module.exports = {
  addTpItem(Data) {
    const dbTableName = Data[1] + '.tp';
    const sqlString = 'INSERT INTO ' + dbTableName + ' (current_status, name_id, mfg, model, capacity, connector, access, address, latitude, longitude, owner) VALUES (?)';
    const DataPrepared = [Data[2], Data[3], Data[4], Data[5], Data[6], Data[7], Data[8], Data[9], Data[10], Data[11], Data[12]];
    return DataBases(sqlString, [DataPrepared]);
  },
  createTpTable(Data, result, size) {
    const newTableName = 'tp_' + result.insertId.toString();
    const sqlString1 = 'USE ' + Data[1];
    const res1 = DataBases(sqlString1, []);
    const sqlString =
      'CREATE TABLE ' +
      newTableName +
      ' ( id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,  ' +
      '   ports VARCHAR(100) NULL DEFAULT NULL , \n' +
      '   self  VARCHAR(100) NULL DEFAULT NULL , \n' +
      '   self_f BIGINT UNSIGNED  );';
    const res2 = DataBases(sqlString, []);
    let sqlPorts = createDataForPorts(size);

    const sqlString2 = 'INSERT INTO ' + Data[1] + '.' + newTableName + ' (ports,self,self_f) VALUES ' + sqlPorts;
    const res3 = DataBases(sqlString2, []);

    return res2;
  },
};
