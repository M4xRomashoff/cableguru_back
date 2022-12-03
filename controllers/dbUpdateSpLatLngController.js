const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateSpLatLngService = require('../services/dbUpdateSpLatLngService');

module.exports = {
  async updateSpLatLng(req, res) {
    const data = {
      dbName: req.body.dbName,
      userId: req.body.userId,
      data: JSON.parse(req.body.data),
    };
    const result = await dbUpdateSpLatLngService.updateSpLatLng(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
