const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateTpItemService = require('../services/dbUpdateTpItemService');
const dbUpdateSplicesTpService = require('../services/dbUpdateTpItemService');
const dbCleanUpTable = require('../services/cleanUpTable');
const dbTpController = require('./dbTpController');

async function sizeUpdateCheck(dbName, tpId, capacity) {
  let response = 'dont need to update ';
  const existData = await dbTpController.getOne(dbName, tpId);
  const existCapacity = parseInt(existData[0].capacity);
  if (capacity !== existCapacity) {
    if (capacity > existCapacity) {
      const responseIncrease = await dbUpdateTpItemService.increaseCapacity(dbName, tpId, existCapacity, capacity);
    }
    if (capacity < existCapacity) {
      const responseDecrease = await dbUpdateTpItemService.decreaseCapacity(dbName, tpId, existCapacity, capacity);
    }
    response = 'item updated';
  }
  return response;
}

module.exports = {
  async setData(req, res) {
    const Data = [
      req.body.dbName,
      req.body.current_status,
      req.body.id,
      req.body.name_id,
      req.body.mfg,
      req.body.model,
      req.body.capacity,
      req.body.connector,
      req.body.access,
      req.body.address,
      req.body.latitude,
      req.body.longitude,
      req.body.owner,
    ];

    // check if size change -> update FCS
    const resultUpdate = await sizeUpdateCheck(req.body.dbName, req.body.id, req.body.capacity);
    console.log('resultUpdate', resultUpdate);

    const result = await dbUpdateTpItemService.updateTpItem(Data);
    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
  async updateSplices(req, res) {
    const data = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      tpId: req.body.tpId,
      cabId1: req.body.cabId1,
      cabId2: req.body.cabId2,
      conType1: req.body.conType1,
      conType2: req.body.conType2,
      fStart1: req.body.fStart1,
      fStart2: req.body.fStart2,
      fEnd1: req.body.fEnd1,
      fEnd2: req.body.fEnd2,
    };
    const result = await dbUpdateSplicesTpService.updateSplices(data);
    const resultFromCleaning = await dbCleanUpTable.cleanUpTable(data);

    if (result?.warningStatus === 0 || result?.warningStatus === 2) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
