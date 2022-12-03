const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

//const itemStateData = [req.body.user_id, req.body.dbName, req.body.item_id, req.body.item_name, req.body.item_type, req.body.item_state];
//                             0                1                  2                3                     4                   5

module.exports = {
  changeItemState(Data) {
    const sqlPart1 = 'UPDATE ' + Data[1] + '.' + Data[4];
    const sqlPart2 = ' SET current_status=' + Data[5].toString();
    const sqlPart3 = ' WHERE id=?';
    const sqlString = sqlPart1 + sqlPart2 + sqlPart3;
    const logDataPrepared = [Data[2]];
    return DataBases(sqlString, [logDataPrepared]);
  },
};
