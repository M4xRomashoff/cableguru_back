const { verifyToken } = require('../utils/jwt');
const { sendStatusData } = require('../utils/sendStatusData');
const { EXPIRED_REFRESH_TOKEN, INVALID_TOKEN, EXPIRED_TOKEN } = require('../constants/responseStrings');
const userService = require('../services/userService');

const setUserWithToken = async ({ req, jwtToken }) => {
  const decodedToken = await verifyToken(jwtToken);
  const [user] = await userService.findById(decodedToken.id);

  if (user?.id) {
    req.user = user;
  }
};

module.exports = {
  ensureToken: async (req, res, next) => {
    const { headers: { authorization } } = req;
    const jwtToken = authorization;

    if (typeof jwtToken === 'undefined') {
      return sendStatusData(res, 401, INVALID_TOKEN);
    }

    try {
      await setUserWithToken({ req, jwtToken });

      return next();
    } catch (error) {
      if (error?.expiredAt) {

        if (req.body.refreshToken) {
          try {
            await setUserWithToken({ req, jwtToken: req.body.refreshToken });
            return next();
          } catch (e) {
            return sendStatusData(res, 403, EXPIRED_REFRESH_TOKEN);
          }
        }

        return sendStatusData(res, 403, EXPIRED_TOKEN);
      }
      return next(error);
    }
  },
};
