const { sendStatusData } = require('../utils/sendStatusData');
const dbLogService = require('../services/dbLogService');

module.exports = {
  async setData(req, res) {
    const user_id = req.body.user_id;
    const dbName = req.body.dbName;
    const item = req.body.item;
    const action = req.body.action;
    const comments = req.body.comments;

    const data = await dbLogService.addLogData([user_id, dbName, item, action, comments]);

    if (data?.warningStatus === 0) return sendStatusData(res, 200, data);

    return sendStatusData(res, 501);
  },
};
