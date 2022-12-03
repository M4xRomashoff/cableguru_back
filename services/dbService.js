const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

module.exports = {
  findAll() {
    return DataBases("show databases where `Database` not regexp 'information_schema|performance_schema|sys|mysql'");
  },
  addAccess(addAccessArray) {
    return DataBases('INSERT INTO users.listdbaccess (user_id, dbName, access_level) VALUES ?', [addAccessArray]);
  },
  removeAccess(user_id, removeAccessArray) {
    return DataBases('DELETE FROM users.listdbaccess WHERE user_id=? AND dbName IN (?)', [user_id, removeAccessArray]);
  },
  deleteDbs(user_id, deleteArray) {
    let counter = 0;
    deleteArray.map((item) => {
      const sql = 'DROP DATABASE IF EXISTS ' + item[0];
      let result = DataBases(sql, []);
      counter += 1;
    });
    return counter;
  },
  updateOptionsDbs(userId, deleteArray) {
    let result = '';
    deleteArray.map((item) => {
      const sql = 'DELETE FROM users.project_options WHERE name="' + item[0] + '";';
      result = DataBases(sql, []);
    });
    return result;
  },

  async getOneProjectOptions(name) {
    let result = '';
    const sql = 'SELECT *  FROM users.project_options WHERE name="' + name + '";';
    result = await DataBases(sql, []);
    return result;
  },
  async setOneProjectOptions(name, options) {
    const sql =
      'UPDATE users.project_options SET coefficient = "' +
      options.coefficient.toString() +
      '" ,' +
      ' att1310 = "' +
      options.att1310.toString() +
      '" ,' +
      ' att1550 = "' +
      options.att1550.toString() +
      '" ,' +
      ' spliceLoss = "' +
      options.spliceLoss.toString() +
      '" ,' +
      ' connectorLoss = "' +
      options.connectorLoss.toString() +
      '" WHERE name="' +
      name +
      '" ;';
    const result = await DataBases(sql, []);
    return result;
  },
};
