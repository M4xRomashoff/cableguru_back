const notFound = 'not found';
const instructions = 'instructions';
const invalid = 'invalid';
const alreadyExist = 'already exist';

const USER_NOT_FOUND = { user: `user ${notFound}` };
const SOMETHING_WENT_WRONG = { server: 'something went wrong' };
const ERROR_VALIDATE_TOKEN = { token: 'error validate token' };
const INVALID_PASSWORD = { password: `${invalid} password` };
const NO_ACCESS = { access: 'no access' };
const INVALID_TOKEN = { token: `${invalid} token` };
const EMAIL_EXISTS = { email: `email ${alreadyExist}` };
const EXPIRED_TOKEN = { token: 'jwt expired'};
const EXPIRED_REFRESH_TOKEN = { token: 'jwt refresh expired'};
const PASSWORD_INSTRUCTIONS = { password: `password ${instructions}` };
const FULL_NAME_INSTRUCTIONS = { name: `fullName ${instructions}` };
const EMAIL_INSTRUCTIONS = { email: `email ${instructions}` };

const EMPTY_DATA = { data: 'empty data' };

module.exports = {
  USER_NOT_FOUND,
  SOMETHING_WENT_WRONG,
  INVALID_PASSWORD,
  PASSWORD_INSTRUCTIONS,
  FULL_NAME_INSTRUCTIONS,
  EMAIL_INSTRUCTIONS,
  INVALID_TOKEN,
  EMAIL_EXISTS,
  EMPTY_DATA,
  EXPIRED_TOKEN,
  ERROR_VALIDATE_TOKEN,
  NO_ACCESS,
  EXPIRED_REFRESH_TOKEN,
}