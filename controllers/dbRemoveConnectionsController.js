const { sendStatusData } = require('../utils/sendStatusData');
const dbRemoveConnectionsService = require('../services/dbRemoveConnectionsService');
const dbCleanUpTable = require('../services/cleanUpTable');

module.exports = {
  async setData(req, res) {
    const data = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      id: req.body.spTpId,
      type: req.body.spTpType,
      cabId: req.body.cabId,
      point: req.body.pointIndex,
      conType: req.body.conType,
    };
    let dataForCleaning = {};
    if (req.body.spTpType === 'sp') {
      dataForCleaning = {
        user_id: req.body.user_id,
        dbName: req.body.dbName,
        spId: req.body.spTpId,
      };
    }
    if (req.body.spTpType === 'tp') {
      dataForCleaning = {
        user_id: req.body.user_id,
        dbName: req.body.dbName,
        tpId: req.body.spTpId,
      };
    }

    const result = await dbRemoveConnectionsService.removeConnections(data);
    const resultFromCleaning = await dbCleanUpTable.cleanUpTable(dataForCleaning);

    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    else return sendStatusData(res, 501, result);
  },
};
