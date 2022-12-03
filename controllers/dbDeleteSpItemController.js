const { sendStatusData } = require('../utils/sendStatusData');
const dbDeleteSpItemService = require('../services/dbDeleteSpItemService');
const dbRemoveConnectionsService = require('../services/dbRemoveConnectionsService');

module.exports = {
  async setData(req, res) {
    const data = {
      userId: req.body.user_id,
      dbName: req.body.dbName,
      spId: req.body.spId,
    };
    const result = await dbDeleteSpItemService.deleteSpItem(data);
    const result2 = await dbDeleteSpItemService.deleteSpItemTable(data);
    const result3 = await dbRemoveConnectionsService.removeConnectionOnlySP(data);
    if (result3?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
