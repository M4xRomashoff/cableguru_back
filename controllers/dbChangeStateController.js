const { sendStatusData } = require('../utils/sendStatusData');
const changeStateController = require('../services/dbChangeStateService');

module.exports = {
  async changeStateController(req, res) {
    const itemStateData = [req.body.user_id, req.body.dbName, req.body.item_id, req.body.item_name, req.body.item_type, req.body.item_state];
    const result = await changeStateController.changeItemState(itemStateData);
    if (result?.warningStatus === 0) return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
