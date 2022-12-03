const util = require('util');
const mysql = require('mysql2');

module.exports = {
  makeDb(config) {
    const connection = mysql.createConnection(config);

    const connectedDB = {
      query(sql, args) {
        return util.promisify(connection.query).call(connection, sql, args);
      },
      close() {
        return util.promisify(connection.end).call(connection);
      },
    };

    return async function (sql, args) {
      let response;
      try {
        response = await connectedDB.query(sql, args);
      } catch (e) {
        console.error(e?.message);
        response = e;
      }
      return response;
    };
  },

  makePoolDb(config) {
    const connection = mysql.createPool(config);
    const connectedPoolDb = {
      query(sql, args) {
        return util.promisify(connection.query).call(connection, sql, args);
      },
      close() {
        return util.promisify(connection.end).call(connection);
      },
    };

    return async function (sql, args) {
      let response;

      try {
        response = await connectedPoolDb.query(sql, args);
      } catch (e) {
        response = e;
      }
      return response;
    };
  },
};
