const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  addConnections(data) {
    const cab_id = data[4];
    let sp_id = 0;
    let tp_id = 0;
    let ring = 0;
    let seq = 0;
    let seq_h = 0;
    if (data[3] === 'sp') sp_id = data[2];
    if (data[3] === 'tp') tp_id = data[2];
    const point = data[5];
    if (data[6] === 'ring') {
      ring = 1;
      seq = 1;
      seq_h = 1000;
    }
    if (data[6] === 'tail') {
      ring = 0;
      seq = 0;
      seq_h = 0;
    }

    const dbTableName = data[1] + '.connections';
    const sqlString = 'INSERT INTO ' + dbTableName + ' (cab_id, sp_id, tp_id, point, ring, seq, seq_h) VALUES (?)';
    const DataPrepared = [cab_id, sp_id, tp_id, point, ring, seq, seq_h];
    return DataBases(sqlString, [DataPrepared]);
  },
  async addCableSpTp(data, type) {
    const tableName = type + '_' + data.id.toString();
    const cabName = 'cab_' + data.cabId.toString();
    const cabNameLow = 'cab_' + data.cabId.toString() + '_l';
    const cabNameHigh = 'cab_' + data.cabId.toString() + '_h';
    const fiber = 'cab_' + data.cabId.toString() + '_f';
    const fiberLow = 'cab_' + data.cabId.toString() + '_l_f';
    const fiberHigh = 'cab_' + data.cabId.toString() + '_h_f';
    const size = data.size;
    const dbName = data.dbName + '.' + tableName;
    let addColumnsSql = '';

    const sql = 'SELECT * FROM ' + dbName;
    const numberOfRows = await DataBases(sql, []);

    if (data.conType === 'ring') {
      addColumnsSql =
        'ALTER TABLE ' + dbName + ' ADD COLUMN (' + cabNameLow + ' VARCHAR(30), ' + fiberLow + ' INTEGER DEFAULT 0 ,' + cabNameHigh + ' VARCHAR(30), ' + fiberHigh + ' INTEGER DEFAULT 0 );';
      const result = await DataBases(addColumnsSql, []);

      let values = '';
      for (let i = 1; i < size; i++) {
        values += '(' + i.toString() + ", '" + cabNameHigh + "', " + i.toString() + ", '" + cabNameLow + "' , " + i.toString() + '),';
      }
      const values2 =
        cabNameLow +
        ' = ' +
        ' VALUES( ' +
        cabNameLow +
        '),' +
        fiberLow +
        ' = ' +
        ' VALUES( ' +
        fiberLow +
        '),' +
        cabNameHigh +
        ' = ' +
        ' VALUES( ' +
        cabNameHigh +
        '),' +
        fiberHigh +
        ' = ' +
        ' VALUES( ' +
        fiberHigh +
        ');';
      values += '(' + size.toString() + ", '" + cabNameHigh + "', " + size.toString() + ", '" + cabNameLow + "' , " + size.toString() + ')';
      const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
      const insSql = 'INSERT INTO ' + dbName + ' ( id ,' + cabNameLow + ', ' + fiberLow + ', ' + cabNameHigh + ', ' + fiberHigh + ') VALUES ' + values + sql2;
      const result1 = await DataBases(insSql, []);
    }
    if (data.conType === 'tail') {
      addColumnsSql = 'ALTER TABLE ' + dbName + ' ADD COLUMN (' + cabName + ' VARCHAR(30), ' + fiber + ' INTEGER DEFAULT 0);';
      const result = await DataBases(addColumnsSql, []);

      let values = '';
      for (let i = 1; i < size; i++) {
        values += '(' + i.toString() + ", '" + cabName + "', 0 ),";
      }
      const values2 = cabName + ' = ' + ' VALUES( ' + cabName + '),' + fiber + ' = ' + ' VALUES( ' + fiber + ');';

      values += '(' + size.toString() + ", '" + cabName + "',  0 )";
      const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
      const insSql = 'INSERT INTO ' + dbName + ' ( id ,' + cabName + ', ' + fiber + ') VALUES ' + values + sql2;
      const result1 = await DataBases(insSql, []);
    }

    return 'ok';
  },
};
