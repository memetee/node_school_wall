const errorTypes = require('../constants/error-types')
const service = require('../service/user.service')
const md5Password = require('../utils/password-handle');

const verifyUser = async (ctx, next) => {
  const {name, password} = ctx.request.body;
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_NOT_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  // 判断用户名或者密码没有被注册过
  const result = await service.getUserByName(name);
  if (result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }
  await next();
}

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  ctx.request.body.password = md5Password(password);
  await next();
}

module.exports = {
  verifyUser,
  handlePassword
}