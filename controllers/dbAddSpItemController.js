const { sendStatusData } = require('../utils/sendStatusData');
const dbAddSpItemService = require('../services/dbAddSpItemService');

module.exports = {
  async setData(req, res) {
    const Data = [
      req.body.user_id,
      req.body.dbName,
      req.body.current_status,
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

    const result = await dbAddSpItemService.addSpItem(Data);
    const result2 = await dbAddSpItemService.createSpTable(Data, result);
    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
