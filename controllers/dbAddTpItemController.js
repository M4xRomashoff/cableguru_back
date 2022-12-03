const { sendStatusData } = require('../utils/sendStatusData');
const dbAddTpItemService = require('../services/dbAddTpItemService');

module.exports = {
  async setData(req, res) {
    const size = req.body.capacity;
    const Data = [
      req.body.user_id,
      req.body.dbName,
      req.body.current_status,
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

    const result = await dbAddTpItemService.addTpItem(Data);
    const result2 = await dbAddTpItemService.createTpTable(Data, result, size);

    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
