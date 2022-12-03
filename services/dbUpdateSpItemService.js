const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');

const DataBases = promiseDb.makeDb(dbList);

//req.body.user_id,
//    0   req.body.dbName,
//    1   req.body.current_status,
//    2   req.body.id,
//    3   req.body.name_id,
//    4   req.body.mfg,
//    5   req.body.model,
//    6   req.body.capacity,
//    7   req.body.spl_type,
//    8   req.body.mount,
//    9   req.body.address,
//    10   req.body.latitude,
//    11  req.body.longitude,
//    12   req.body.owner,
//

function getSubString(names, item) {
  let subString = item.id + ' , ';

  for (let i = 1; i < names.length; i = i + 2) {
    subString += ' " ' + item[names[i]] + ' ", ';
    subString += item[names[i + 1]].toString() + ' ,';
  }

  subString = subString.slice(0, -1);
  return subString;
}

async function updateSpAfterRingToTail(_dbName, spData, sp_id, drop1, drop2, drop3, drop4, new1, new2) {
  const dbName = _dbName + '.sp_' + sp_id.toString();
  const size = spData.length - 1;
  let sql = '';
  let values = ' DROP COLUMN ' + drop1 + ' , ' + ' DROP COLUMN ' + drop2 + ' , ' + ' DROP COLUMN ' + drop3 + ' , ' + ' DROP COLUMN ' + drop4 + ' ; ';
  sql = 'ALTER TABLE ' + dbName + ' ' + values;
  const result = await DataBases(sql, []);

  sql = 'ALTER TABLE ' + dbName + ' ADD COLUMN (' + new1 + ' VARCHAR(30), ' + new2 + ' INTEGER DEFAULT 0 );';
  const result2 = await DataBases(sql, []);

  const names = Object.keys(spData[0]);
  values = '';
  let tableNames = names[0] + ' , ';
  for (let i = 1; i < names.length; i++) {
    tableNames += names[i] + ' , ';
  }
  tableNames = tableNames.slice(0, -2);
  for (let i = 0; i < size; i++) {
    values += '( ' + getSubString(names, spData[i]) + '),';
  }
  values += '( ' + getSubString(names, spData[size]) + ')';
  let values2 = '';
  for (let i = 0; i < names.length; i++) {
    values2 += names[i] + ' = ' + 'VALUES( ' + names[i] + '),';
  }
  values2 = values2.slice(0, -1);
  values2 += ';';
  const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
  const insSql = 'INSERT INTO ' + dbName + ' ( ' + tableNames + ') VALUES ' + values + sql2;
  const result1 = await DataBases(insSql, []);
}

module.exports = {
  updateSpItem(data) {
    const sql1 = ' UPDATE ' + data[0] + '.sp ';
    const sql2 = ' SET  current_status = ' + data[1];
    const sql3 = ', name_id = "' + data[3] + '" ';
    const sql4 = ', mfg = "' + data[4] + '" ';
    const sql5 = ', model = "' + data[5] + '" ';
    const sql6 = ', capacity = "' + data[6] + '" ';
    const sql7 = ', spl_type = "' + data[7] + '" ';
    const sql8 = ', mount = "' + data[8] + '" ';
    const sql9 = ', address = "' + data[9] + '" ';
    const sql10 = ', latitude = "' + data[10] + '" ';
    const sql11 = ', longitude = "' + data[11] + '" ';
    const sql12 = ', owner = "' + data[12] + '" ';

    const sql13 = ' WHERE id=' + data[2].toString();
    const sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6 + sql7 + sql8 + sql9 + sql10 + sql11 + sql12 + sql13;
    return DataBases(sql, []);
  },

  updateSplices(data) {
    let c1 = 'cab_' + data.cabId1.toString();
    let c2 = 'cab_' + data.cabId2.toString();
    if (data.conType1 === 'low') c1 += '_l';
    if (data.conType1 === 'high') c1 += '_h';
    if (data.conType2 === 'low') c2 += '_l';
    if (data.conType2 === 'high') c2 += '_h';
    let colf1 = c1 + '_f';
    let colf2 = c2 + '_f';

    let values1 = '';
    let values2 = '';
    for (let i = data.fStart1, inc = 0; i < data.fEnd1; i++, inc++) {
      values1 += '( ' + i.toString() + ", '" + c2 + "' ," + (data.fStart2 + inc).toString() + '),';
    }
    values1 += '( ' + data.fEnd1.toString() + ", '" + c2 + "' ," + data.fEnd2.toString() + ')';
    values2 = c1 + ' = ' + ' VALUES( ' + c1 + '),' + colf1 + ' = ' + ' VALUES( ' + colf1 + ');';
    const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
    const insSql = 'INSERT INTO ' + data.dbName + '.sp_' + data.spId.toString() + ' ( id ,' + c1 + ', ' + colf1 + ') VALUES ' + values1 + sql2;
    const res1 = DataBases(insSql, []);

    values1 = '';
    values2 = '';
    for (let i = data.fStart2, inc = 0; i < data.fEnd2; i++, inc++) {
      values1 += '( ' + i.toString() + ", '" + c1 + "' ," + (data.fStart1 + inc).toString() + '),';
    }
    values1 += '( ' + data.fEnd2.toString() + ", '" + c1 + "' ," + data.fEnd1.toString() + ')';
    values2 = c2 + ' = ' + ' VALUES( ' + c2 + '),' + colf2 + ' = ' + ' VALUES( ' + colf2 + ');';
    const sql3 = ' ON DUPLICATE KEY UPDATE ' + values2;
    const insSql2 = 'INSERT INTO ' + data.dbName + '.sp_' + data.spId.toString() + ' ( id ,' + c2 + ', ' + colf2 + ') VALUES ' + values1 + sql3;
    const res2 = DataBases(insSql2, []);

    return DataBases(insSql2, []);
  },

  async changeSpRingToTail(sp_id, cab_id, type, dbName) {
    // get original data
    let sql = 'SELECT * FROM ' + dbName + '.sp_' + sp_id.toString() + ';';
    const spData = await DataBases(sql, []);
    const names = Object.keys(spData[0]);
    const old_lo = 'cab_' + cab_id.toString() + '_l';
    const old_hi = 'cab_' + cab_id.toString() + '_h';
    const fib_lo = old_lo + '_f';
    const fib_hi = old_hi + '_f';
    const new_ca = 'cab_' + cab_id.toString();
    const new_fi = 'cab_' + cab_id.toString() + '_f';

    if (type === 'low') {
      for (let i = 0; i < spData.length; i++) {
        if (spData[i][old_lo] !== undefined && spData[i][old_lo] !== null && names.includes(spData[i][old_lo])) {
          if (spData[i][old_lo] === old_lo) {
            spData[i][old_lo] = new_ca;
            spData[i][fib_lo] = 0;
          }
          if (spData[i][old_lo] === old_hi) {
            spData[i][old_lo] = new_ca;
            spData[i][fib_lo] = 0;
          } else {
            let other_side_name = spData[i][old_lo];
            let other_side_fiber = spData[i][fib_lo] - 1;
            spData[other_side_fiber][other_side_name] = new_ca;
          }
        }
        if (spData[i][old_hi] !== undefined && spData[i][old_hi] !== null && spData[i][old_hi] !== old_lo && names.includes(spData[i][old_hi])) {
          let other_side_name = spData[i][old_hi];
          let other_side_fiber = spData[i][fib_hi] - 1;
          spData[other_side_fiber][other_side_name] = other_side_name;
          spData[other_side_fiber][other_side_name + '_f'] = 0;
        }
      }
      for (let i = 0; i < spData.length; i++) {
        delete spData[i][old_hi];
        delete spData[i][fib_hi];
        let item = JSON.stringify(spData[i]);
        item = item.replace(old_lo, new_ca);
        item = item.replace(fib_lo, new_fi);
        spData[i] = JSON.parse(item);
      }
    }
    if (type === 'high') {
      for (let i = 0; i < spData.length; i++) {
        if (spData[i][old_hi] !== undefined && spData[i][old_hi] !== null && names.includes(spData[i][old_hi])) {
          if (spData[i][old_hi] === old_hi) {
            spData[i][old_hi] = new_ca;
            spData[i][fib_hi] = 0;
          }
          if (spData[i][old_hi] === old_lo) {
            spData[i][old_hi] = new_ca;
            spData[i][fib_hi] = 0;
          } else {
            let other_side_name = spData[i][old_hi];
            let other_side_fiber = spData[i][fib_hi] - 1;
            spData[other_side_fiber][other_side_name] = new_ca;
          }
        }
        if (spData[i][old_lo] !== undefined && spData[i][old_lo] !== null && spData[i][old_lo] !== old_hi && names.includes(spData[i][old_lo])) {
          let other_side_name = spData[i][old_lo];
          let other_side_fiber = spData[i][fib_lo] - 1;
          spData[other_side_fiber][other_side_name] = other_side_name;
          spData[other_side_fiber][other_side_name + '_f'] = 0;
        }
      }
      for (let i = 0; i < spData.length; i++) {
        delete spData[i][old_lo];
        delete spData[i][fib_lo];
        let item = JSON.stringify(spData[i]);
        item = item.replace(old_hi, new_ca);
        item = item.replace(fib_hi, new_fi);
        spData[i] = JSON.parse(item);
      }
    }

    const result = updateSpAfterRingToTail(dbName, spData, sp_id, old_lo, old_hi, fib_lo, fib_hi, new_ca, new_fi);

    return 'ok';
  },
  async increaseCableCapacity(dbName, spId, existCapacity, capacity, cabId, ring) {
    const dbNameTp_ = dbName + '.sp_' + spId.toString();
    const startNumber = existCapacity + 1;
    const endNumber = capacity;

    if (ring[0] === 0) {
      const cable = 'cab_' + cabId.toString();
      const fiber = cable + '_f';

      let values1 = '';
      let values2 = '';
      for (let i = startNumber; i < endNumber + 1; i++) {
        values1 += '( ' + i.toString() + ', "' + cable + '", 0), ';
      }
      values1 = values1.slice(0, -2);

      values2 = ' ON DUPLICATE KEY UPDATE ' + cable + ' =  VALUES(' + cable + '), ' + fiber + ' = VALUES (' + fiber + ');';
      const insSql = 'INSERT INTO ' + dbNameTp_ + ' ( id ,' + cable + ', ' + fiber + ') VALUES ' + values1 + values2;
      const result = DataBases(insSql, []);
    }

    if (ring[0] === 1) {
      const cable_lo = 'cab_' + cabId.toString() + '_l';
      const cable_hi = 'cab_' + cabId.toString() + '_h';
      const fiber_lo = cable_lo + '_f';
      const fiber_hi = cable_hi + '_f';

      let values1 = '';
      let values2 = '';
      for (let i = startNumber; i < endNumber + 1; i++) {
        values1 += '( ' + i.toString() + ', "' + cable_hi + '",' + i.toString() + ', "' + cable_lo + '", ' + i.toString() + ' ), ';
      }
      values1 = values1.slice(0, -2);

      values2 =
        ' ON DUPLICATE KEY UPDATE ' +
        cable_lo +
        ' = VALUES (' +
        cable_lo +
        '),' +
        fiber_lo +
        ' = VALUES (' +
        fiber_lo +
        '),' +
        cable_hi +
        ' = VALUES (' +
        cable_hi +
        '),' +
        fiber_hi +
        ' = VALUES (' +
        fiber_hi +
        ');';
      const insSql = 'INSERT INTO ' + dbNameTp_ + ' ( id ,' + cable_lo + ', ' + fiber_lo + ',' + cable_hi + ', ' + fiber_hi + ') VALUES ' + values1 + values2;
      const result = DataBases(insSql, []);
    }

    return 'ok';
  },
  async decreaseCableCapacity(dbName, spId, existCapacity, capacity, cabId, ring) {
    const dbNameTp_ = dbName + '.sp_' + spId.toString();
    const startNumber = capacity + 1;
    const endNumber = existCapacity;
    if (ring[0] === 0) {
      const cable = 'cab_' + cabId.toString();
      const fiber = cable + '_f';

      let values1 = '';
      let values2 = '';

      for (let i = startNumber; i < endNumber + 1; i++) {
        values1 += '( ' + i.toString() + ', "" , 0), ';
      }
      values1 = values1.slice(0, -2);

      values2 = ' ON DUPLICATE KEY UPDATE ' + cable + ' =  VALUES(' + cable + '),' + fiber + ' = VALUES (' + fiber + ');';
      const insSql = 'INSERT INTO ' + dbNameTp_ + ' ( id ,' + cable + ', ' + fiber + ') VALUES ' + values1 + values2;
      const result = DataBases(insSql, []);
      return result;
    }

    if (ring[0] === 1) {
      const cable_lo = 'cab_' + cabId.toString() + '_l';
      const cable_hi = 'cab_' + cabId.toString() + '_h';
      const fiber_lo = cable_lo + '_f';
      const fiber_hi = cable_hi + '_f';

      let values1 = '';
      let values2 = '';
      for (let i = startNumber; i < endNumber + 1; i++) {
        values1 += '( ' + i.toString() + ', "", 0 , "", 0), ';
      }
      values1 = values1.slice(0, -2);

      values2 =
        ' ON DUPLICATE KEY UPDATE ' +
        cable_lo +
        ' = VALUES (' +
        cable_lo +
        '),' +
        fiber_lo +
        ' = VALUES (' +
        fiber_lo +
        '),' +
        cable_hi +
        ' = VALUES (' +
        cable_hi +
        '),' +
        fiber_hi +
        ' = VALUES (' +
        fiber_hi +
        ');';
      const insSql = 'INSERT INTO ' + dbNameTp_ + ' ( id ,' + cable_lo + ', ' + fiber_lo + ',' + cable_hi + ', ' + fiber_hi + ') VALUES ' + values1 + values2;
      const result = DataBases(insSql, []);
      return result;
    }

    return 'ok';
  },
};
