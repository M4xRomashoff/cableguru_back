const { sendStatusData } = require('../utils/sendStatusData');
const { NO_ACCESS } = require('../constants/responseStrings');
const { ADMIN_LEVEL } = require('../constants');

module.exports = {
  checkAdmin: (req, res, next) => {
    if (req?.user?.access_level !== ADMIN_LEVEL) return sendStatusData(res, 403, NO_ACCESS);

    return next();
  },
};