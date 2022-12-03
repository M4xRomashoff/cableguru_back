const { sendStatusData } = require('../utils/sendStatusData');
const dbAddConnectionsService = require('../services/dbAddConnectionsService');

module.exports = {
  async setData(req, res) {
    const Data = [req.body.user_id, req.body.dbName, req.body.spTpId, req.body.spTpType, req.body.cabId, req.body.pointIndex, req.body.conType];
    const DataObj = {
      user_id: req.body.user_id,
      dbName: req.body.dbName,
      id: req.body.spTpId,
      type: req.body.spTpType,
      cabId: req.body.cabId,
      point: req.body.pointIndex,
      conType: req.body.conType,
      size: parseInt(req.body.cabSize),
    };
    let return1 = '';
    const result = await dbAddConnectionsService.addConnections(Data);
    if (result?.warningStatus === 0) return1 = sendStatusData(res, 200);
    else return1 = sendStatusData(res, 501, result);

    if (req.body.spTpType === 'sp' || req.body.spTpType === 'tp') {
      const resultSp = await dbAddConnectionsService.addCableSpTp(DataObj, req.body.spTpType);
    }

    return null;
  },
};
