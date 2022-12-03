const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

async function dbProcess(sql5, []) {
  const result = await DataBases(sql5, []);
  return result;
}

module.exports = {
  async removeConnections(data) {
    let result = '';
    const cab_id = data.cabId;
    let dbName = data.dbName;
    let sp_id = 0;
    let tp_id = 0;
    if (data.type === 'sp') sp_id = data.id;
    if (data.type === 'tp') tp_id = data.id;

    const sql1 = ' DELETE FROM ' + dbName + '.connections ';
    const sql2 = ' WHERE  cab_id = ' + cab_id;
    const sql3 = ' AND sp_id = ' + sp_id;
    const sql4 = ' AND tp_id = ' + tp_id;

    const sql = sql1 + sql2 + sql3 + sql4;
    const result1 = await DataBases(sql, []);
    //       remove cables from sp tp items

    if (result1?.warningStatus === 0) {
      let values = '';
      if (data.conType == 'tail') {
        values += ' DROP COLUMN ' + 'cab_' + cab_id.toString() + ' , DROP COLUMN ' + 'cab_' + cab_id.toString() + '_f ;';
      }
      if (data.conType == 'ring') {
        values +=
          ' DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_l , DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_l_f,  DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_h , DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_h_f ;';
      }
      const sql = 'ALTER TABLE ' + dbName + '.' + data.type + '_' + data.id + ' ' + values;
      result = await DataBases(sql, []);
    }
    // add consistency check
    return result;
  },

  async removeConnectionsDelCable(dbName, listOfSpTp) {
    let result = 'ok';
    listOfSpTp.map((item) => {
      const cab_id = item.cab_id;
      let sp_id = item.sp_id;
      let tp_id = item.tp_id;

      const sql1 = ' DELETE FROM ' + dbName + '.connections ';
      const sql2 = ' WHERE  cab_id = ' + cab_id;
      const sql3 = ' AND sp_id = ' + sp_id;
      const sql4 = ' AND tp_id = ' + tp_id;

      const sql5 = sql1 + sql2 + sql3 + sql4;
      const result1 = dbProcess(sql5, []);

      //       remove cables from sp tp items

      let values = '';
      if (item.ring[0] === 0) {
        values += ' DROP COLUMN ' + 'cab_' + cab_id.toString() + ' , DROP COLUMN ' + 'cab_' + cab_id.toString() + '_f ;';
      }
      if (item.ring[0] === 1) {
        values +=
          ' DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_l , DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_l_f,  DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_h , DROP COLUMN ' +
          'cab_' +
          cab_id.toString() +
          '_h_f ;';
      }
      let sql = '';
      if (sp_id !== 0) sql = 'ALTER TABLE ' + dbName + '.sp_' + sp_id.toString() + ' ' + values;
      if (tp_id !== 0) sql = 'ALTER TABLE ' + dbName + '.tp_' + tp_id.toString() + ' ' + values;
      result = DataBases(sql, []);
    });

    return result;
  },
  async removeConnectionOnlySP(data) {
    const dbName = data.dbName + '.connections ';
    const sql = ' DELETE FROM ' + dbName + ' WHERE sp_id = ' + data.spId.toString() + ' ; ';
    const result = await DataBases(sql, []);
    return result;
  },
  async removeConnectionOnlyTP(data) {
    const dbName = data.dbName + '.connections ';
    const sql = ' DELETE FROM ' + dbName + ' WHERE tp_id = ' + data.tpId.toString() + ' ; ';
    const result = await DataBases(sql, []);
    return result;
  },
  async removeConnectionOnlyCable(data) {
    const dbName = data.dbName + '.connections ';
    const sql = ' DELETE FROM ' + dbName + ' WHERE cab_id = ' + data.cableId.toString() + ' ; ';
    const result = await DataBases(sql, []);
    return result;
  },
  async getConnectedItemsCable(data) {
    const dbName = data.dbName + '.connections ';
    const sql = ' SELECT * FROM ' + dbName + ' WHERE cab_id = ' + data.cableId.toString() + ' ; ';
    const result = await DataBases(sql, []);
    return result;
  },
  async getConnectedItemsCableByid(_dbName, cableId) {
    const dbName = _dbName + '.connections ';
    const sql = ' SELECT * FROM ' + dbName + ' WHERE cab_id = ' + cableId.toString() + ' ; ';
    const result = await DataBases(sql, []);
    return result;
  },
};
