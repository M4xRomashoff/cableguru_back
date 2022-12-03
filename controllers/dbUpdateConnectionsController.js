const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateConnectionsService = require('../services/dbUpdateConnectionsService');

module.exports = {
  async setData(req, res) {
    const data = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      data: JSON.parse(req.body.data),
    };
    const result = await dbUpdateConnectionsService.updateConnections(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    else return sendStatusData(res, 501, result);
  },
};
