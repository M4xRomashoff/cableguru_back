const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  updateSeqNumbers(data) {
    try {
      const dbName = data.dbName;
      let type = 'sp_id';
      if (data.type === 'tp') type = 'tp_id';
      const id = data.id;
      const cablesList = data.data;
      let sql = '';
      let result = '';

      for (let i = 0; i < cablesList.length; i++) {
        if (cablesList[i].type === 'tail') {
          sql = 'UPDATE ' + dbName + '.connections SET seq=' + cablesList[i].seq + ' WHERE cab_id= ' + cablesList[i].id.toString() + ' AND ' + type + ' = ' + id.toString() + ';';
          result = DataBases(sql, []);
        }
        if (cablesList[i].type === 'low') {
          sql =
            'UPDATE ' +
            dbName +
            '.connections SET seq=' +
            cablesList[i].seq +
            ' , seq_h=' +
            cablesList[i + 1].seq +
            '   WHERE cab_id= ' +
            cablesList[i].id.toString() +
            ' AND ' +
            type +
            ' = ' +
            id.toString() +
            ';';
          result = DataBases(sql, []);
        }
      }
      return result;
    } catch (e) {
      return e;
    }
  },
};
