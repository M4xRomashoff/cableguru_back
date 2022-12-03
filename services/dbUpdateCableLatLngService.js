const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');
const { convertToString } = require('../utils/CablePointsToStringServer');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  updateCableLatLng(data) {
    const dbName = data.dbName + '.cable';
    const idLL = data.data;
    let values1 = '';
    let values2 = '';
    idLL.map((item) => {
      values1 += ' ( ' + item.id + ' , "' + convertToString(item.latlngs) + '" ) ,';
    });
    values1 = values1.slice(0, -2);
    values2 = 'points = VALUES ( points ) ;';
    const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
    const insSql = 'INSERT INTO ' + dbName + ' ( id , points  ) VALUES ' + values1 + sql2;
    const res = DataBases(insSql, []);
    return 'ok';
  },
};
