const { sendStatusData } = require('../utils/sendStatusData');
const updateSeqNumbersService = require('../services/updateSeqNumbersService');

module.exports = {
  async update(req, res) {
    const data = {
      dbName: req.body.dbName,
      userId: req.body.userId,
      id: req.body.id,
      type: req.body.type,
      data: JSON.parse(req.body.cables),
    };
    const result = await updateSeqNumbersService.updateSeqNumbers(data);
    if (result?.warningStatus === 0 || 'ok') return sendStatusData(res, 200);
    return sendStatusData(res, 501, result);
  },
};
