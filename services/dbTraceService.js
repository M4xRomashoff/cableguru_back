const promiseDb = require('../utils/promiseDb');
const { dbUsersPool } = require('../config/config');
const { createSql } = require('../utils/createSql');
const { getOneCable } = require('./dbCableService');
const { findOneCableConnections } = require('./dbGetConnectionsService');
const { getCablePointsFromString } = require('../utils/getCablePointsFromStringServer');
const { convertToString, convertToStringPoint } = require('../utils/CablePointsToStringServer');

const Db = promiseDb.makePoolDb(dbUsersPool);

async function prepareTraceData(dbName, traceArray) {
  const finalData = [];
  let points = [];
  let port = 0;
  for (let i = 0; i < traceArray.length; i++) {
    if (traceArray[i].cabId > 0) {
      const cable = await getOneCable(dbName, traceArray[i].cabId);
      points = getCablePointsFromString(cable[0].points);
      const cabSize = cable[0].capacity;
      const fiber = traceArray[i].fiber;
      const startP = traceArray[i].startPoint;
      const endP = traceArray[i].endPoint;
      port = traceArray[i].portId;
      const portPoint = points[traceArray[i].startPoint];
      if (startP > -1 && endP > -1 && traceArray[i].fiber !== 0) {
        let newPoints = [];
        if (startP > endP) {
          for (let i = endP; i < startP + 1; i++) {
            newPoints.push(points[i]);
          }
        }
        if (startP < endP) {
          for (let i = startP; i < endP + 1; i++) {
            newPoints.push(points[i]);
          }
        }

        if (traceArray[i].itemType === 'sp' || (traceArray[i].itemType === 'tp' && i !== 0)) {
          finalData.push({ points: convertToString(newPoints), fiber: fiber, cabSize: cabSize, port: 0, portPoint: '0,0', itemType: traceArray[i].itemType, itemId: traceArray[i].itemId });
        } else
          finalData.push({
            points: convertToString(newPoints),
            fiber: fiber,
            cabSize: cabSize,
            port: port,
            portPoint: convertToStringPoint(portPoint),
            itemType: traceArray[i].itemType,
            itemId: traceArray[i].itemId,
          });
      } else {
        const portPoint = points[traceArray[i].endPoint];
        finalData.push({
          points: [],
          fiber: 0,
          cabSize: 0,
          port: traceArray[i - 1].fiber,
          portPoint: convertToStringPoint(portPoint),
          itemType: traceArray[i].itemType,
          itemId: traceArray[i].itemId,
        });
      }
    } else {
      const portPoint = points[traceArray[i].endPoint];
      finalData.push({
        points: [],
        fiber: 0,
        cabSize: 0,
        port: traceArray[i].portId,
        portPoint: convertToStringPoint(portPoint),
        itemType: traceArray[i].itemType,
        itemId: traceArray[i].itemId,
      });
    }
  }
  return finalData;
}

async function getSpFiberConnection(cabId, fiber, sp_id, up, ring, dbName) {
  let cabName = '';
  if (ring[0] === 1 && up) {
    cabName = 'cab_' + cabId.toString() + '_l';
  }
  if (ring[0] === 1 && !up) {
    cabName = 'cab_' + cabId.toString() + '_h';
  }
  if (ring[0] === 0) {
    cabName = 'cab_' + cabId.toString();
  }

  const sql = 'SELECT * FROM ' + dbName + '.sp_' + sp_id.toString() + ' WHERE id=' + fiber.toString() + ';';
  const result = await Db(sql, []);

  return { cabName: result[0][cabName], fiber: result[0][cabName + '_f'], type: 'sp', itemId: sp_id };
}

async function getTpFiberConnection(cabId, fiber, tp_id, up, ring, dbName) {
  let cabName = '';
  if (ring[0] === 1 && up) {
    cabName = 'cab_' + cabId.toString() + '_l';
  }
  if (ring[0] === 1 && !up) {
    cabName = 'cab_' + cabId.toString() + '_h';
  }
  if (ring[0] === 0) cabName = 'cab_' + cabId.toString();

  const sql = 'SELECT * FROM ' + dbName + '.tp_' + tp_id.toString() + ' WHERE id=' + fiber.toString() + ';';
  const result = await Db(sql, []);

  return { cabName: result[0][cabName], fiber: result[0][cabName + '_f'], type: 'tp', itemId: tp_id };
}

function sortCon(filteredCon, up) {
  let sortedCon = [];
  if (up) sortedCon = filteredCon.sort((a, b) => a.point - b.point);
  else sortedCon = filteredCon.sort((a, b) => b.point - a.point);

  return sortedCon;
}

async function filterConnections(cableCon, cabPoint, up) {
  let filteredCon = [];
  for (let i = 0; i < cableCon.length; i++) {
    if (up && cableCon[i].point > cabPoint) filteredCon.push(cableCon[i]);
    if (!up && cableCon[i].point < cabPoint) filteredCon.push(cableCon[i]);
  }
  filteredCon = sortCon(filteredCon, up);

  return filteredCon;
}

async function getNextSegment(cabId, type, fiber, cabPoint, itemId, itemType, dbName) {
  let endPoint = 0;
  let nextStartPoint = {};
  // direction of search up or down cable points
  let up = true;
  if (type === 'tail' && cabPoint === 0) up = true;
  else up = false;
  if (type === 'lo') up = false;
  if (type === 'hi') up = true;

  const cable = await getOneCable(dbName, cabId);

  if (up) endPoint = getCablePointsFromString(cable[0].points).length - 1; // else !up endPoint = 0

  const cableCon = await findOneCableConnections(dbName, cabId);
  const cableConFiltered = await filterConnections(cableCon, cabPoint, up);
  let tempResult = {};
  if (cableConFiltered.length === 0) {
    tempResult = { cabId: cabId, fiber: fiber, type: 'none', itemId: 0 };
  } else {
    for (let i = 0; i < cableConFiltered.length; i++) {
      if (cableConFiltered[i].sp_id !== 0) {
        tempResult = await getSpFiberConnection(cabId, fiber, cableConFiltered[i].sp_id, up, cableConFiltered[i].ring, dbName);
        endPoint = cableConFiltered[i].point;
      }
      if (cableConFiltered[i].tp_id !== 0) {
        tempResult = await getTpFiberConnection(cabId, fiber, cableConFiltered[i].tp_id, up, cableConFiltered[i].ring, dbName);
        endPoint = cableConFiltered[i].point;
      }
      if (extractCabInfo(tempResult.cabName).cabId === cabId && tempResult.fiber === fiber) {
        tempResult = { cabId: cabId, fiber: fiber, type: 'none', itemId: 0 };
        endPoint = cableConFiltered[i].point;
      } else break;
    }
  }
  tempResult['startPoint'] = cabPoint;
  tempResult['endPoint'] = endPoint;
  nextStartPoint = tempResult;
  return nextStartPoint;
}

async function getTpPortConnection(dbName, tpId, port) {
  const sql = 'SELECT * FROM ' + dbName + '.tp_' + tpId.toString() + ' WHERE id = ' + port.toString() + ';';
  return Db(sql, []);
}

async function getPointOfConnection(_dbName, type, cabId, itemId) {
  let point = -1;
  const dbName = _dbName + '.connections';
  if (type === 'tp') {
    const sql = 'SELECT * FROM ' + dbName + ' WHERE tp_id= ' + itemId.toString() + ' AND cab_id = ' + cabId.toString() + ';';
    const response = await Db(sql, []);
    point = response[0]?.point;
  }
  if (type === 'sp') {
    const sql = 'SELECT * FROM ' + dbName + ' WHERE sp_id= ' + itemId.toString() + ' AND cab_id = ' + cabId.toString() + ';';
    const response = await Db(sql, []);
    point = response[0]?.point;
  }
  return point;
}

function extractCabInfo(name) {
  if (name) {
    let type = 'none';
    let cabId = 0;
    const arr = name.split('_');
    if (arr.length === 2) {
      type = 'tail';
      cabId = parseInt(arr[1]);
    }
    if (arr.length === 3) {
      if (arr[2] === 'l') type = 'low';
      if (arr[2] === 'h') type = 'high';
      cabId = parseInt(arr[1]);
    }
    return { type: type, cabId: cabId };
  } else return { type: 'none', cabId: 0 };
}

module.exports = {
  async findTrace(dbName, tpId, port) {
    const traceArray = [];
    let subArray = { cabId: 0, point: 0, fiber: 0, itemId: 0, itemType: 'none', portId: 0 };
    let goFlag = true;
    const response = await getTpPortConnection(dbName, tpId, port);
    if (response[0].self !== 'self') {
      let itemTypeNext = 'tp';
      let itemId = tpId;
      let fiberNext = response[0]['self_f'];
      let cabIdNext = extractCabInfo(response[0]['self']).cabId;
      let cabTypeNext = extractCabInfo(response[0]['self']).type;
      let endPoint = -1;
      let startPoint = -1;

      do {
        let cabPoint = await getPointOfConnection(dbName, itemTypeNext, cabIdNext, itemId);
        let nextsegment = await getNextSegment(cabIdNext, cabTypeNext, fiberNext, cabPoint, itemId, itemTypeNext, dbName);
        subArray = {
          cabId: cabIdNext,
          point: cabPoint,
          fiber: fiberNext,
          itemId: itemId,
          itemType: itemTypeNext,
          portId: port,
          endPoint: nextsegment.endPoint,
          startPoint: nextsegment.startPoint,
        };
        traceArray.push(subArray);
        itemTypeNext = nextsegment.type;
        itemId = nextsegment.itemId;
        fiberNext = nextsegment.fiber;
        cabIdNext = extractCabInfo(nextsegment.cabName).cabId;
        cabTypeNext = extractCabInfo(nextsegment.cabName).type;

        if (nextsegment.fiber === 0 || nextsegment.type === 'none' || nextsegment.cabName === 'self') {
          goFlag = false;
          subArray = {
            cabId: cabIdNext,
            point: -1,
            fiber: fiberNext,
            itemId: itemId,
            itemType: itemTypeNext,
            portId: fiberNext,
            endPoint: nextsegment.endPoint,
            startPoint: nextsegment.startPoint,
          };
          traceArray.push(subArray);
          break;
        }
      } while (goFlag);
    } else console.log('fiber is not spliced');

    // return Db(sql, []);

    const finalData = await prepareTraceData(dbName, traceArray);
    return finalData;
  },
};
