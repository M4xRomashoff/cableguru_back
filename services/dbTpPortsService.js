const promiseDb = require('../utils/promiseDb');
const { dbNoDbSelected } = require('../config/config');
const { createSqlFcsConnectionsTp, createSqlFcsCables, createSqlFcsTp } = require('../utils/createSql');

const DbSp = promiseDb.makePoolDb(dbNoDbSelected);

module.exports = {
  getTpPorts(dbName, tpId) {
    const sql = 'SELECT ports FROM ' + dbName + '.tp_' + tpId.toString() + ';';
    return DbSp(sql, []);
  },
  setTpPorts(dbName, tpId, portsData) {
    const sbName_tp = dbName + '.tp_' + tpId.toString();
    const size = portsData.length;
    let values = '';
    for (let i = 0; i < size; i++) {
      values += '( ' + (i + 1).toString() + ',"' + portsData[i].ports + '"),';
    }
    values = values.slice(0, -1);

    const sql2 = ' ON DUPLICATE KEY UPDATE id = VALUES (id), ports = VALUES (ports)';
    const insSql = 'INSERT INTO ' + sbName_tp + ' ( id, ports ) VALUES ' + values + sql2;
    return DbSp(insSql, []);
  },
};
