const { sendStatusData } = require('../utils/sendStatusData');
const dbDeleteTpItemService = require('../services/dbDeleteTpItemService');
const dbRemoveConnectionsService = require('../services/dbRemoveConnectionsService');

module.exports = {
  async deleteData(req, res) {
    const data = {
      userId: req.body.user_id,
      dbName: req.body.dbName,
      tpId: req.body.tpId,
    };

    const result = await dbDeleteTpItemService.deleteTpItem(data);
    const result2 = await dbDeleteTpItemService.deleteTpItemTable(data);
    const result3 = await dbRemoveConnectionsService.removeConnectionOnlyTP(data);
    if (result3?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
