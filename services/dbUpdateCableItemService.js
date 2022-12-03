const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');
const dbRemoveConnectionsService = require('./dbRemoveConnectionsService');
const dbUpdateSpItem = require('./dbUpdateSpItemService');
const dbUpdateTpItem = require('./dbUpdateTpItemService');

const DataBases = promiseDb.makeDb(dbList);

//    0 req.body.dbName,
//    1 req.body.current_status,
//    2 req.body.id,
//    3 req.body.name_id,
//    4 req.body.mfg,
//    5 req.body.model,
//    6 req.body.capacity,
//    7 req.body.f_type,
//    8 req.body.p_type,
//    9 req.body.c_type,
//   10 req.body.points,
//   11 req.body.owner,
//   11 req.body.birthday,

module.exports = {
  updateCableItem(data) {
    const sql1 = ' UPDATE ' + data[0] + '.cable ';
    const sql2 = ' SET  current_status = ' + data[1];
    const sql3 = ', name_id = "' + data[3] + '" ';
    const sql4 = ', mfg = "' + data[4] + '" ';
    const sql5 = ', model = "' + data[5] + '" ';
    const sql6 = ', capacity = "' + data[6] + '" ';
    const sql7 = ', f_type = "' + data[7] + '" ';
    const sql8 = ', p_type = "' + data[8] + '" ';
    const sql9 = ', c_type = "' + data[9] + '" ';
    const sql10 = ', points = "' + data[10] + '" ';
    const sql11 = ', owner = "' + data[11] + '" ';
    const sql12 = ', birthday = STR_TO_DATE("' + data[12].slice(0, 10) + '", "%Y-%m-%d") ';

    const sql13 = ' WHERE id=' + data[2].toString();
    const sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6 + sql7 + sql8 + sql9 + sql10 + sql11 + sql12 + sql13;
    return DataBases(sql, []);
  },
  async increaseCapacity(dbName, cabId, existCapacity, capacity) {
    let listOfSpTp = [];
    listOfSpTp = await dbRemoveConnectionsService.getConnectedItemsCableByid(dbName, cabId);
    if (listOfSpTp.length > 0) {
      for (let i = 0; i < listOfSpTp.length; i++) {
        if (listOfSpTp[i].sp_id !== 0) {
          const result = dbUpdateSpItem.increaseCableCapacity(dbName, listOfSpTp[i].sp_id, existCapacity, capacity, cabId, listOfSpTp[i].ring);
        }
        if (listOfSpTp[i].tp_id !== 0) {
          const result = dbUpdateTpItem.increaseCableCapacity(dbName, listOfSpTp[i].tp_id, existCapacity, capacity, cabId, listOfSpTp[i].ring);
        }
      }
    }
    return listOfSpTp;
  },
  async decreaseCapacity(dbName, cabId, existCapacity, capacity) {
    let listOfSpTp = [];
    listOfSpTp = await dbRemoveConnectionsService.getConnectedItemsCableByid(dbName, cabId);
    if (listOfSpTp.length > 0) {
      for (let i = 0; i < listOfSpTp.length; i++) {
        if (listOfSpTp[i].sp_id !== 0) {
          const result = dbUpdateSpItem.decreaseCableCapacity(dbName, listOfSpTp[i].sp_id, existCapacity, capacity, cabId, listOfSpTp[i].ring);
        }
        if (listOfSpTp[i].tp_id !== 0) {
          const result = dbUpdateTpItem.decreaseCableCapacity(dbName, listOfSpTp[i].tp_id, existCapacity, capacity, cabId, listOfSpTp[i].ring);
        }
      }
    }
    console.log(' decreaseCapacity(dbName, cabId, existCapacity, capacity) {', listOfSpTp);
    return listOfSpTp;
  },
};
