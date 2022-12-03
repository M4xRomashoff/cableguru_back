var express = require('express')
const userRouter = new express.Router()
const userController = require('../controllers/userController');
const { ensureToken } = require('../middleware/ensureToken');
const { checkAdmin } = require('../middleware/checkAdmin');

userRouter.get('/', ensureToken, userController.getAll)
userRouter.post('/login', userController.login)
userRouter.post('/refresh-token', ensureToken, userController.refreshToken)
userRouter.post('/', ensureToken, checkAdmin, userController.addUser);
userRouter.get('/:id/db', ensureToken, userController.getUsersDb);
userRouter.get('/:id', ensureToken, userController.getUserById);
userRouter.delete('/:id', ensureToken, checkAdmin, userController.deleteUser);

module.exports = userRouter