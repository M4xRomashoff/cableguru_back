const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateSpItemService = require('../services/dbUpdateSpItemService');
const dbUpdateSplicesSpService = require('../services/dbUpdateSpItemService');
const dbCleanUpTable = require('../services/cleanUpTable');

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
      req.body.spl_type,
      req.body.mount,
      req.body.address,
      req.body.latitude,
      req.body.longitude,
      req.body.owner,
    ];
    const result = await dbUpdateSpItemService.updateSpItem(Data);
    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },

  async updateSplices(req, res) {
    const data = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      spId: req.body.spId,
      cabId1: req.body.cabId1,
      cabId2: req.body.cabId2,
      conType1: req.body.conType1,
      conType2: req.body.conType2,
      fStart1: req.body.fStart1,
      fStart2: req.body.fStart2,
      fEnd1: req.body.fEnd1,
      fEnd2: req.body.fEnd2,
    };
    const result = await dbUpdateSplicesSpService.updateSplices(data);
    const resultFromCleaning = await dbCleanUpTable.cleanUpTable(data);

    if (result?.warningStatus === 0 || result?.warningStatus === 2) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
