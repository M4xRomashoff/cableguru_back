const { sendStatusData } = require('../utils/sendStatusData');
const dbAddCableItemService = require('../services/dbAddCableItemService');

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
      req.body.f_type,
      req.body.p_type,
      req.body.c_type,
      req.body.points,
      req.body.owner,
    ];

    const result = await dbAddCableItemService.addCableItem(Data);
    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
