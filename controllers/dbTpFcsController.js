const { sendStatusData } = require('../utils/sendStatusData');
const dbTpFcsService = require('../services/dbTpFcsService');
const { getCablePointsFromString } = require('../utils/getCablePointsFromStringServer');

function getDirectionByTwoPoints(startPoint, endPoint) {
  let direction = 'unknown';
  const x1 = startPoint.lat - endPoint.lat;
  const x2 = startPoint.lng - endPoint.lng;
  const z = Math.atan2(x1, x2);
  if (z > -0.3 && z <= 0.3) direction = 'West ';
  if (z > 0.3 && z <= 1.32) direction = ' South-West ';
  if (z > 1.32 && z <= 1.8) direction = ' South ';
  if (z > 1.8 && z <= 2.85) direction = ' South-East ';
  if ((z > 2.85 && z <= 3.15) || (z < -2.85 && z > -3.15)) direction = ' East ';
  if (z > -2.85 && z <= -1.8) direction = ' North-East ';
  if (z > -1.8 && z <= -1.32) direction = ' North ';
  if (z > -1.32 && z <= -0.3) direction = ' North-West ';
  return direction;
}

function getDirection(cable, item, conType) {
  let direction = [];
  const cablePoints = getCablePointsFromString(cable.points);
  const cableLength = cablePoints.length;

  if (conType === 'tail') {
    if (item.point === 0) {
      direction = getDirectionByTwoPoints(cablePoints[0], cablePoints[1]);
    }
    if (item.point > 0) {
      direction = getDirectionByTwoPoints(cablePoints[cableLength - 1], cablePoints[cableLength - 2]);
    }
  }
  if (conType === 'ringLow') {
    direction.push(getDirectionByTwoPoints(cablePoints[item.point], cablePoints[item.point - 1]));
  }
  if (conType === 'ringHigh') {
    direction.push(getDirectionByTwoPoints(cablePoints[item.point], cablePoints[item.point + 1]));
  }
  return direction;
}

function getIndexesOfNumbers(item) {
  if (!item) return [0, 0];
  let ind1 = 0;
  let ind2 = 0;
  for (let i = 1; i < item.length; i++) {
    if (item[i] !== '' && ind1 !== 0) ind2 = i;
    if (item[i] !== '' && ind1 === 0) ind1 = i;
  }
  return [ind1, ind2];
}
function createShortData(longData) {
  if (longData.length === 0) return [['empty'], ['empty']];
  const xLen = longData[0].length;
  let newItem = [];
  for (let x = 0; x < xLen; x++) newItem.push('');
  const yLen = longData.length;
  let shortData = [];
  let c1 = 0;
  let c2 = 0;
  let start1 = 0;
  let start2 = 0;
  let end1 = 0;
  let end2 = 0;
  let i1 = 0;
  let i2 = 0;

  for (let y = 0; y < yLen + 1; y++) {
    [i1, i2] = getIndexesOfNumbers(longData[y]);
    if (c1 === 0) {
      c1 = i1;
      c2 = i2;
      start1 = longData[y][i1];
      start2 = longData[y][i2];
      end1 = longData[y][i1];
      end2 = longData[y][i2];
    } else {
      if (c1 === i1 && c2 === i2 && end1 + 1 === longData[y][i1] && end2 + 1 === longData[y][i2]) {
        end1 = longData[y][i1];
        end2 = longData[y][i2];
      } else {
        let newItemCopy = newItem.slice(0);
        if (start1 < end1) {
          newItemCopy[c1] = start1.toString() + '-' + end1.toString();
          newItemCopy[c2] = start2.toString() + '-' + end2.toString();
        } else {
          newItemCopy[c1] = start1.toString();
          newItemCopy[c2] = start2.toString();
        }
        shortData.push(newItemCopy);
        c1 = i1;
        c2 = i2;
        if (i1 === 0) return shortData; // end of list;
        start1 = longData[y][i1];
        start2 = longData[y][i2];
        end1 = longData[y][i1];
        end2 = longData[y][i2];
      }
    }
  }
  return shortData;
}

function createRefTable(item) {
  const table = [];
  const keys = Object.keys(item);
  let i = keys.length;
  while (i--) {
    if ((keys[i].charAt(keys[i].length - 1) !== 'f' || keys[i] === 'self') && keys[i] !== 'ports') table.unshift(keys[i]);
  }
  return table;
}

function combineDataSplices(dataFromConnections, dataFromCables, dataFromTp, dataHeader) {
  if (dataFromTp.length === 0) return [['empty'], ['empty']];

  const resultData = [];
  const dataItem = [];
  for (let i = 0; i < dataHeader[0].length; i++) {
    dataItem.push('');
  }
  const refTable = createRefTable(dataFromTp[0]);

  for (let j = 1; j < refTable.length + 1; j++) {
    let ref = refTable[j];
    for (let i = 0; i < dataFromTp.length; i++) {
      let item = dataFromTp[i];
      let fiberDest = 0;
      let fiberSource = 0;
      let cableDest = '';
      let newItem = dataItem.slice(0);

      if (item[ref] !== ref) {
        cableDest = item[ref];
        fiberDest = item[ref + '_f'];
        fiberSource = i + 1;

        newItem[j] = fiberSource;
        newItem[refTable.indexOf(item[ref])] = fiberDest;

        if (refTable.indexOf(cableDest) > j) {
          if (j === 1) {
            newItem[0] = item.ports;
            newItem[1] = i + 1;
          }
          resultData.push(newItem);
        }
      }
    }
  }
  const shortData = createShortData(resultData);
  return [shortData, resultData];
}

function combineData(con, cab) {
  const data = [];
  const dataId = ['ID', 'panel'];
  const dataSize = ['Size', ' '];
  const dataType = ['Type', ' '];
  const dataDirection = ['Direction ', ' '];
  const dataDoB = ['Date of Birth ', ' '];
  const dataMfg = ['Manufacturer ', ' '];
  const dataSeq = ['Sequential # ', 'ports'];
  con.map((item) => {
    const cable = cab.find((element) => element.id === item.cab_id);
    if (item.ring.toString('hex') === '00') {
      dataId.push(cable.name_id);
      dataSize.push(cable.capacity);
      dataType.push('tail');
      dataDirection.push(getDirection(cable, item, 'tail'));
      dataDoB.push(cable.birthday.toLocaleDateString());
      dataMfg.push(cable.mfg);
      dataSeq.push(item.seq);
    }
    if (item.ring.toString('hex') === '01') {
      dataId.push(cable.name_id, cable.name_id);
      dataSize.push(cable.capacity, cable.capacity);
      dataType.push('ring', 'ring');
      dataDirection.push(getDirection(cable, item, 'ringLow'), getDirection(cable, item, 'ringHigh'));
      dataDoB.push(cable.birthday.toLocaleDateString(), cable.birthday.toLocaleDateString());
      dataMfg.push(cable.mfg, cable.mfg);
      dataSeq.push(item.seq, item.seq_h);
    }
  });
  data.push(dataId, dataSize, dataType, dataDirection, dataDoB, dataMfg, dataSeq);
  return data;
}

module.exports = {
  async getData(req, res) {
    const array = req?.params?.dbName.split(',');
    const dbName = array[0];
    const tpId = array[1];

    const dataFromConnections = await dbTpFcsService.getConnections(dbName, tpId);
    const cablesId = dataFromConnections.map((c_id) => c_id.cab_id);
    const dataFromCables = await dbTpFcsService.getCables(dbName, cablesId);
    const dataFromTp = await dbTpFcsService.getTp(dbName, tpId);
    const dataHeader = combineData(dataFromConnections, dataFromCables);
    const [dataSplicesShort, dataSplicesFull] = combineDataSplices(dataFromConnections, dataFromCables, dataFromTp, dataHeader);
    const data = { header: dataHeader, body: dataSplicesShort, bodyFull: dataSplicesFull };
    return sendStatusData(res, 200, data);

    return sendStatusData(res, 501);
  },
};
