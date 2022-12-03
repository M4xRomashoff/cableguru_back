const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  updateTpLatLng(data) {
    const dbName = data.dbName + '.tp';
    const idLL = data.data;
    let values1 = '';
    let values2 = '';
    idLL.map((item) => {
      values1 += ' ( ' + item.id + ' , ' + item.latlng.lat + ' , ' + item.latlng.lng + ' ) ,';
    });
    values1 = values1.slice(0, -2);
    values2 = 'latitude = VALUES ( latitude ), longitude = VALUES ( longitude ) ;';
    const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
    const insSql = 'INSERT INTO ' + dbName + ' ( id , latitude, longitude  ) VALUES ' + values1 + sql2;
    const res = DataBases(insSql, []);
    return 'ok';
  },
};
