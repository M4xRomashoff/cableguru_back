const promiseDb = require('../utils/promiseDb');
const { dbList, dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');
const DataBases = promiseDb.makeDb(dbList);
const DbSp = promiseDb.makePoolDb(dbUsersPool);
const DbTp = promiseDb.makePoolDb(dbUsersPool);

function convertData(data, item) {
  const convertedData = {
    userId: data.user_id,
    dbName: data.dbName,
    spId: item.sp_id,
    tpId: item.tp_id,
  };
  return convertedData;
}

module.exports = {
  cleanUpTableMultiple(data, result2) {
    result2.map((item) => {
      const dataPrepared = convertData(data, item);
      const result = this.cleanUpTable(dataPrepared);
    });
    return 'ok';
  },

  findAllTp(dbName, id) {
    const sql = createSql(dbName, '.tp_' + id.toString());
    return DbTp(sql);
  },
  findAllSp(dbName, id) {
    const sql = createSql(dbName, '.sp_' + id.toString());
    return DbSp(sql);
  },

  async cleanUpTable(data) {
    let insSql = '';
    ///----------------------------TP---------------------------------------------------------------------------------
    if (data.tpId) {
      const tpData = await this.findAllTp(data.dbName, data.tpId);
      if (tpData !== undefined) {
        const names = Object.keys(tpData[0]);
        const cables = [];
        for (let ci = 2; ci < names.length; ci += 2) {
          cables.push(names[ci]);
        }
        tpData.map((item, index) => {
          cables.map((cab) => {
            const a_cab = item[cab];
            const a_fib = item[cab + '_f'];
            if (a_cab) {
              if (a_cab !== cab) {
                if (a_fib > 0 && a_fib < tpData.length + 1) {
                  const z_cab = tpData[a_fib - 1][a_cab];
                  const z_fib = tpData[a_fib - 1][a_cab + '_f'];
                  if (!(z_cab === cab) || !(z_fib === index + 1)) {
                    tpData[index][cab] = cab;
                    tpData[index][cab + '_f'] = 0;
                  }
                }
              } else if (a_fib !== 0) tpData[index][cab + '_f'] = 0; // itself set 0 if different
            }
          });
        });

        //save after clean Up!-------------------------------------
        let colNames = ' ( ';
        let insertValues = '';
        let updateValues = '';

        names.map((name) => {
          colNames += name + ',';
        });
        colNames = colNames.slice(0, -1); // remove extra (,)
        colNames += ' ) VALUES ';
        tpData.map((item, index) => {
          insertValues += ' ( ' + (index + 1).toString() + " , '" + item.ports + "' , ";
          cables.map((name) => {
            insertValues += "'" + item[name] + "', " + item[name + '_f'] + ' ,';
          });
          insertValues = insertValues.slice(0, -1);
          insertValues += '),';
        });
        insertValues = insertValues.slice(0, -1);
        updateValues = ' ON DUPLICATE KEY UPDATE ';
        names.map((name) => {
          updateValues += name + ' = ' + ' VALUES( ' + name + ' ),';
        });
        updateValues = updateValues.slice(0, -1);
        updateValues += ';';
        insSql = 'INSERT INTO ' + data.dbName + '.tp_' + data.tpId.toString() + colNames + insertValues + updateValues;
      }
    }
    ///----------------------------SP-----------------------------------------------------------------------------------
    if (data.spId) {
      const spData = await this.findAllSp(data.dbName, data.spId);

      if (spData !== undefined) {
        const names = Object.keys(spData[0]);
        if (names.length > 1) {
          const cables = [];
          for (let ci = 1; ci < names.length; ci += 2) {
            cables.push(names[ci]);
          }
          spData.map((item, index) => {
            cables.map((cab) => {
              const a_cab = item[cab];
              const a_fib = item[cab + '_f'];
              if (a_cab) {
                if (a_cab !== cab) {
                  if (a_fib > 0 && a_fib < spData.length + 1) {
                    const z_cab = spData[a_fib - 1][a_cab];
                    const z_fib = spData[a_fib - 1][a_cab + '_f'];
                    if (!(z_cab === cab) || !(z_fib === index + 1)) {
                      spData[index][cab] = cab;
                      spData[index][cab + '_f'] = 0;
                    }
                  }
                } else if (a_fib !== 0) spData[index][cab + '_f'] = 0; // itself set 0 if different
              }
            });
          });

          //save after clean Up!-------------------------------------
          let colNames = ' ( ';
          let insertValues = '';
          let updateValues = '';

          names.map((name) => {
            colNames += name + ',';
          });
          colNames = colNames.slice(0, -1); // remove extra (,)
          colNames += ' ) VALUES ';
          spData.map((item, index) => {
            insertValues += ' ( ' + (index + 1).toString() + ' , ';
            cables.map((name) => {
              insertValues += "'" + item[name] + "', " + item[name + '_f'] + ' ,';
            });
            insertValues = insertValues.slice(0, -1);
            insertValues += '),';
          });
          insertValues = insertValues.slice(0, -1);
          updateValues = ' ON DUPLICATE KEY UPDATE ';
          names.map((name) => {
            updateValues += name + ' = ' + ' VALUES( ' + name + ' ),';
          });
          updateValues = updateValues.slice(0, -1);
          updateValues += ';';

          insSql = 'INSERT INTO ' + data.dbName + '.sp_' + data.spId.toString() + colNames + insertValues + updateValues;
        }
      }
    }

    const res1 = await DataBases(insSql, []);
    return res1;
  },
};
