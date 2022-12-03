const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');

const DbConnections = promiseDb.makePoolDb(dbUsersPool);

module.exports = {
  findAll(dbName) {
    const sql = createSql(dbName, '.connections');

    return DbConnections(sql, []);
  },

  findOneCableConnections(dbName, cabId) {
    const sql = 'SELECT * FROM ' + dbName + '.connections WHERE cab_id=' + cabId.toString() + ';';
    const cableConnectionsData = DbConnections(sql, []);
    return cableConnectionsData;
  },
};
