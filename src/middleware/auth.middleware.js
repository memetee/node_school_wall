const jwt = require('jsonwebtoken');
const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service');
const authService = require('../service/auth.service')
const md5Password = require('../utils/password-handle');
const { PUBLIC_KEY } = require('../app/config')
async function verifyLogin(ctx, next) {
  const {name, password} = ctx.request.body;
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_NOT_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  // 判断用户是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 判断密码是否和数据库中的密码是否一致
  if (md5Password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx);
  }
  ctx.user = user;

  await next();
}
async function success (ctx, next) {
  ctx.body = '授权成功~'
}

const verifyAuth = async (ctx, next) => {
  console.log('用户访问中...')
  // 取出token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  
  const token = authorization.replace('Bearer ', '');
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result;
    await next();
  } catch(err) {
    console.log('验证token', err);
    const error = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit('error', error, ctx);
  }
}

const verifyPermission = (tableName) => {
  return async (ctx, next) => {
    console.log('验证权限的middleware~')
    // 1.获取参数
    const [resourceKey] = Object.keys(ctx.params);
    const resourceId = ctx.params[resourceKey];
    const { id } = ctx.user;
    // 2.查询是否具备权限
    try {
      const isPermission = await authService.checkResource(tableName, resourceId, id);
      if (!isPermission) throw new Error();
      await next();
    } catch(err) {
      console.log('查询权限失败', err);
      const error = new Error(errorTypes.UNPERMISSION);
      return ctx.app.emit('error', error, ctx);
    }
  }
}


module.exports = {
  verifyLogin,
  success,
  verifyAuth,
  verifyPermission
}