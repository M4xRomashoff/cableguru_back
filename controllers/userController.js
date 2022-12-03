const { sendStatusData } = require('../utils/sendStatusData');
const { INVALID_PASSWORD, NO_ACCESS, USER_NOT_FOUND } = require('../constants/responseStrings');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const dbService = require('../services/dbService');
const { ADMIN_LEVEL } = require('../constants');

const salt = 10;
const hashPassword = (password) => bcrypt.hash(password, salt);

const generateToken = ({ user, expiresIn = '5m' }) => {
  const id = { id: user.id };
  return jwt.sign(id, process.env.JWT_SECRET, { expiresIn });
};

function createToken(user) {
  const accessToken = generateToken({ user });
  const refreshToken = generateToken({ user, expiresIn: '8h' });

  return {
    accessToken,
    refreshToken,
    ...user,
  };
}

module.exports = {
  async login(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;

    const [user] = await userService.findByUserName({ userName });

    if (!user?.id) return sendStatusData(res, 501);

    const isSamePassword = await bcrypt.compare(password, user.pwd);
    // const isSamePassword = password === user.pwd;

    if (isSamePassword) {
      const userWithToken = createToken(user);
      delete userWithToken.pwd;
      return sendStatusData(res, 200, userWithToken);
    }

    return sendStatusData(res, 401, INVALID_PASSWORD);
  },
  async refreshToken(req, res) {
    const newUserInfo = createToken(req.user);

    return sendStatusData(res, 200, newUserInfo);
  },
  async getAll(req, res) {
    const users = await userService.findAll();

    if (Array.isArray(users)) return sendStatusData(res, 200, users);

    return sendStatusData(res, 501);
  },

  async getUserById(req, res) {
    let userId = req.params.id;

    const user = await userService.findById(userId);

    return sendStatusData(res, user?.id ? 200 : 501, user);
  },

  async deleteUser(req, res) {
    let userId = req.params.id;

    // cant delete yourself

    if (userId === req.user.id) return sendStatusData(res, 403, NO_ACCESS);

    const [user] = await userService.findById(userId);

    if (!user?.id) return sendStatusData(res, 404, USER_NOT_FOUND);

    // cant delete admin user
    if (user.access_level === ADMIN_LEVEL) return sendStatusData(res, 403, NO_ACCESS);

    const deletedUser = await userService.deleteUser(userId);

    // if user removed
    if (deletedUser?.serverStatus === 2) {
      // also need to remove user from dbaccess
      const userDbs = userService.getUsersDb(userId);
      if (!userDbs) {
        const deleteDbNames = userDbs.map(({ dbName }) => [userId, dbName]);
        await dbService.removeAccess(deleteDbNames);
      }

      return sendStatusData(res, 200, { user_id: userId });
    }

    return sendStatusData(res, 501, deletedUser);
  },

  async addUser(req, res) {
    const { name, password, password_confirmation, password_hint, phone, company, email, access } = req.body || {};
    const hashedPassword = await hashPassword(password);
    const records = [name, hashedPassword, password_hint, email, phone, company, access];
    const newUser = await userService.addUser(records);
    if (newUser?.insertId) return sendStatusData(res, 200, newUser);
    return sendStatusData(res, 501, newUser);
  },

  async getUsersDb(req, res) {
    const usersDb = await userService.getUsersDb(req.params.id);
    return sendStatusData(res, usersDb ? 200 : 501, usersDb);
  },
};
