const promiseDb = require('../utils/promiseDb');
const { dbList } = require('../config/config');
const { convertToString } = require('../utils/CablePointsToStringServer');
const dbDeleteCableItemService = require('./dbDeleteCableItemService');
const dbRemoveConnectionsService = require('./dbRemoveConnectionsService');
const cleanUpTable = require('../services/cleanUpTable');
const cableService = require('./dbCableService');
const connectionService = require('./dbGetConnectionsService');
const { getCablePointsFromString } = require('../utils/getCablePointsFromStringServer');
const dbUpdateSpItemService = require('./dbUpdateSpItemService');
const dbUpdateTpItemService = require('./dbUpdateTpItemService');

const DataBases = promiseDb.makeDb(dbList);

function createTable(oldP, newP) {
  const table = [];
  newP.map((np, nIndex) => {
    oldP.map((op, oIndex) => {
      if (np.lat === op.lat && np.lng === op.lng) table.push(oIndex);
    });
  });
  return table;
}

async function removeConnection(item, dbName) {
  const listOfSpTp = [item];

  const result = await dbRemoveConnectionsService.removeConnectionsDelCable(dbName, listOfSpTp);
  return result;
}

async function updateConnectionsListOfItems(dataList, _dbName) {
  if (dataList.length === 0) return 'ok';
  let dbName = _dbName + '.connections';

  let values1 = '';
  let values2 = '';
  dataList.map((item) => {
    let ring = '0';
    if (item.ring[0] === 0) ring = '0';
    else ring = '1';
    values1 +=
      ' ( ' +
      item.id.toString() +
      ' , ' +
      item.cab_id.toString() +
      ' , ' +
      item.sp_id.toString() +
      ' , ' +
      item.tp_id.toString() +
      ' , ' +
      item.point.toString() +
      ' , ' +
      ring +
      ' , ' +
      item.seq.toString() +
      ' , ' +
      item.seq_h.toString() +
      ' ) ,';
  });
  values1 = values1.slice(0, -2);
  values2 =
    'id = VALUES ( id ), ' +
    'cab_id = VALUES ( cab_id ), ' +
    'sp_id = VALUES ( sp_id ), ' +
    'tp_id = VALUES ( tp_id ), ' +
    'point = VALUES ( point ), ' +
    'ring = VALUES ( ring ), ' +
    'seq = VALUES ( seq ), ' +
    'seq_h = VALUES ( seq_h );';

  const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
  const insSql = 'INSERT INTO ' + dbName + ' ( id , cab_id, sp_id, tp_id, point, ring, seq, seq_h  ) VALUES ' + values1 + sql2;
  const res = DataBases(insSql, []);

  return 'ok';
}

async function pointsConnectionsCheck(item, dbName, userId) {
  const cabId = item.cabId;
  const cableLatLngs = item.latlngs;
  const existCable = await cableService.getOneCable(dbName, cabId);
  const cableConnections = await connectionService.findOneCableConnections(dbName, cabId);
  const listOfConToUpdate = [];
  const oldP = getCablePointsFromString(existCable[0].points);
  const newP = getCablePointsFromString(item.latlngs);
  const oldMax = oldP.length - 1;
  const newMax = newP.length - 1;
  const table = createTable(oldP, newP);
  cableConnections.map((item) => {
    if (table.includes(item.point)) {
      if (table.indexOf(item.point) === 0) {
        item.ring[0] = 0;
        item.seq = item.seq_h;
        item.seq_h = 0;
        if (item.sp_id > 0) dbUpdateSpItemService.changeSpRingToTail(item.sp_id, item.cab_id, 'high', dbName);
        if (item.tp_id > 0) dbUpdateTpItemService.changeTpRingToTail(item.tp_id, item.cab_id, 'high', dbName);
      }
      if (table.indexOf(item.point) === newMax) {
        item.ring[0] = 0;
        item.seq_h = 0;
        if (item.sp_id > 0) dbUpdateSpItemService.changeSpRingToTail(item.sp_id, item.cab_id, 'low', dbName);
        if (item.tp_id > 0) dbUpdateTpItemService.changeTpRingToTail(item.tp_id, item.cab_id, 'low', dbName);
      }
      item.point = table.indexOf(item.point);
      listOfConToUpdate.push(item);
    } else {
      const result = removeConnection(item, dbName);
    }
  });

  if (listOfConToUpdate.length > 0) updateConnectionsListOfItems(listOfConToUpdate, dbName);
}

function conAdd(newData, item) {
  let flag = true;
  newData.map((newItem) => {
    if (item.cabId === newItem.cabId && item.action === newItem.action)
      if (item.latlngs.length <= newItem.latlngs.length) {
        newItem.latlngs = item.latlngs.slice();
        flag = false;
      }

    if (item.cabId === newItem.cabId && item.action === 'delete cable' && newItem.action === 'remove point') {
      newItem.action = 'delete cable';
      flag = false;
    }

    if (item.cabId === newItem.cabId && item.action === newItem.action) {
      flag = false;
    }
  });
  return flag;
}

async function prepareData(dataFix) {
  const newData = [];
  dataFix.map((item) => {
    if (conAdd(newData, item) === true) newData.push(item);
  });
  return newData;
}

async function deleteCable(dataFix, dbName, userId) {
  const data = {
    userId: userId,
    dbName: dbName,
    cableId: dataFix.cabId,
  };
  const result = await dbDeleteCableItemService.deleteCableItem(data);
  const listOfSpTp = await dbRemoveConnectionsService.getConnectedItemsCable(data);
  const result2 = await dbRemoveConnectionsService.removeConnectionsDelCable(data.dbName, listOfSpTp);
  if (listOfSpTp.length > 0) {
    const result3 = cleanUpTable.cleanUpTableMultiple(data, listOfSpTp);
  }
}

module.exports = {
  async updateConnectionsFix(data) {
    let dataFix = data.dataFix;
    const dbName = data.dbName;
    const userId = data.user_id;
    if (dataFix.length === 0) return 'ok';

    if (dataFix.length > 1) dataFix = await prepareData(dataFix);

    dataFix.map((item) => {
      if (item.action === 'delete cable') {
        deleteCable(item, dbName, userId);
      }

      if (item.action === 'remove point') {
        pointsConnectionsCheck(item, dbName, userId);
      }
    });

    return 'ok';
  },
  //------------------------------------------------------------------------------------------------
  async updateConnections(data) {
    if (data.data.length === 0) return 'ok';
    let dbName = data.dbName + '.connections';
    const dataCon = data.data;
    let values1 = '';
    let values2 = '';
    dataCon.map((item) => {
      values1 += ' ( ' + item.id + ' , ' + item.point.toString() + ' ) ,';
    });
    values1 = values1.slice(0, -2);
    values2 = 'point = VALUES ( point ) ;';
    const sql2 = ' ON DUPLICATE KEY UPDATE ' + values2;
    const insSql = 'INSERT INTO ' + dbName + ' ( id , point  ) VALUES ' + values1 + sql2;
    const res = DataBases(insSql, []);

    return 'ok';
  },
};
