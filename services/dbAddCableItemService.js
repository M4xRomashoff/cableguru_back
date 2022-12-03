const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');
const DataBases = promiseDb.makeDb(dbList);

//
//  0   req.body.user_id,
//  1   req.body.dbName,
//  2   req.body.current_status,
//  3   req.body.name_id,
//  4   req.body.mfg,
//  5   req.body.model,
//  6   req.body.capacity,
//  7   req.body.f_type,
//  8   req.body.p_type,
//  9   req.body.c_type,
// 10   req.body.points,
// 11   req.body.owner,

module.exports = {
  addCableItem(Data) {
    const dbTableName = Data[1] + '.cable';
    const sqlString = 'INSERT INTO ' + dbTableName + ' (current_status, name_id, mfg, model, capacity, f_type, p_type, c_type, points, owner) VALUES (?)';
    const DataPrepared = [Data[2], Data[3], Data[4], Data[5], Data[6], Data[7], Data[8], Data[9], Data[10], Data[11]];

    return DataBases(sqlString, [DataPrepared]);
  },
};
