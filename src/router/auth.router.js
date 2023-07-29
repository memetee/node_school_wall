
const Router = require('koa-router');

const authRouter = new Router();

const {
  login
} = require('../controller/auth.controller.js')
const {
  verifyLogin,
  verifyAuth,
  success
} = require('../middleware/auth.middleware.js');

authRouter.post('/login', verifyLogin, login);
authRouter.get('/test', verifyAuth, success)

module.exports = authRouter;