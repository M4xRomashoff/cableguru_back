const { sendStatusData } = require('../utils/sendStatusData');
const dbGetProjectOptionsService = require('../services/dbService');

module.exports = {
  async getOne(req, res) {
    const dbName = req?.params?.dbName;
    const projectOptions = await dbGetProjectOptionsService.getOneProjectOptions(dbName);
    if (Array.isArray(projectOptions)) return sendStatusData(res, 200, projectOptions);
    return sendStatusData(res, 501);
  },
  async setOne(req, res) {
    const dbName = req.body.dbName;
    const options = {
      coefficient: req.body.coefficient,
      att1310: req.body.att1310,
      att1550: req.body.att1550,
      spliceLoss: req.body.spliceLoss,
      connectorLoss: req.body.connectorLoss,
    };
    const response = await dbGetProjectOptionsService.setOneProjectOptions(dbName, options);
    if (response !== 'error') return sendStatusData(res, 200, response);
    return sendStatusData(res, 501);
  },
};
