const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateConnectionsFixService = require('../services/dbUpdateConnectionsService');

module.exports = {
  async setData(req, res) {
    const data = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      dataFix: JSON.parse(req.body.dataFix),
    };
    const result = await dbUpdateConnectionsFixService.updateConnectionsFix(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    else return sendStatusData(res, 501, result);
  },
};
