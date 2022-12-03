const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { jwtSecret } = require('../config/config');

const asyncJWTVerify = promisify(jwt.verify);

module.exports = {
  getAccessToken(value) {
    return jwt.sign(value, jwtSecret, { expiresIn: '8h' });
  },
  getRefreshToken(value) {
    jwt.sign(value, jwtSecret, { expiresIn: '30d' });
  },
  verifyToken(token) {
    return asyncJWTVerify(token, jwtSecret);
  },
  decodeToken(token) {
    return jwt.decode(token, jwtSecret);
  },
};
