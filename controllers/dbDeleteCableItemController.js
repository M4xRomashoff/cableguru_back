const { sendStatusData } = require('../utils/sendStatusData');
const dbDeleteCableItemService = require('../services/dbDeleteCableItemService');
const dbRemoveConnectionsService = require('../services/dbRemoveConnectionsService');
const cleanUpTable = require('../services/cleanUpTable');

module.exports = {
  async setData(req, res) {
    const data = {
      userId: req.body.user_id,
      dbName: req.body.dbName,
      cableId: req.body.cableId,
    };

    const result = await dbDeleteCableItemService.deleteCableItem(data);
    const listOfSpTp = await dbRemoveConnectionsService.getConnectedItemsCable(data);
    const result2 = await dbRemoveConnectionsService.removeConnectionsDelCable(data.dbName, listOfSpTp);
    if (listOfSpTp.length > 0) {
      const result3 = cleanUpTable.cleanUpTableMultiple(data, listOfSpTp);
    }
    if (result2?.warningStatus === 0 || result2 === 'ok') return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
