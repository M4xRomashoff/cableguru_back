const { sendStatusData } = require('../utils/sendStatusData');
const dbUpdateCableLatLngService = require('../services/dbUpdateCableLatLngService');

module.exports = {
  async updateCableLatLng(req, res) {
    const data = {
      dbName: req.body.dbName,
      userId: req.body.userId,
      data: JSON.parse(req.body.data),
    };
    const result = await dbUpdateCableLatLngService.updateCableLatLng(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
