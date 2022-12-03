const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateCableItemService = require('../services/dbUpdateCableItemService');
const dbCableController = require('./dbCableController');
const dbUpdateTpItemService = require('../services/dbUpdateTpItemService');

async function sizeUpdateCheck(dbName, cabId, capacity) {
  let response = [];
  const existData = await dbCableController.getOne(dbName, cabId);
  const existCapacity = parseInt(existData[0].capacity);
  if (capacity !== existCapacity) {
    if (capacity > existCapacity) {
      response = await dbUpdateCableItemService.increaseCapacity(dbName, cabId, existCapacity, capacity);
    }
    if (capacity < existCapacity) {
      response = await dbUpdateCableItemService.decreaseCapacity(dbName, cabId, existCapacity, capacity);
    }
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
      req.body.f_type,
      req.body.p_type,
      req.body.c_type,
      req.body.points,
      req.body.owner,
      req.body.birthday,
    ];

    const resultUpdate = await sizeUpdateCheck(req.body.dbName, req.body.id, req.body.capacity);

    const result = await dbUpdateCableItemService.updateCableItem(Data);
    if (result?.warningStatus === 0) return sendStatusData(res, 200, resultUpdate);
    return sendStatusData(res, 501, result);
  },
};
