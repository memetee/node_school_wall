
const errorTypes = require('../constants/error-types');
const errorHandler = (error, ctx) => {
  let status, message;
  switch(error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_NOT_REQUIRED:
      status = 400;
      message = '用户名或者密码不能为空~'
    break;
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409;
      message = '用户名已存在~'
    break;
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400;
      message = '用户不存在~'
    break;
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400;
      message = '密码不正确~'
    break;
    case errorTypes.UNAUTHORIZATION:
      status = 401;
      message = '无效的token~'
    break;
    case errorTypes.UNPERMISSION:
      status = 403;
      message = '无权限~'
    break;
    case errorTypes.ADD_COLLECT_MOMENT_FAIL:
      status = 500;
      message = '收藏动态失败~'
    break;
    case errorTypes.CREATE_MOMENT_FAIL:
      status = 500;
      message = '创建动态失败~'
    break;
    case errorTypes.GET_MOMENT_FAIL:
      status = 400;
      message = '获取动态详情失败~'
    break;
    case errorTypes.GET_MOMENT_LIST_ALL:
      status = 400;
      message = '获取动态列表失败失败~'
    break;
    case errorTypes.GET_MOMENT_LIST_HOT:
      status = 400;
      message = '获取热点列表失败失败~'
    break;
    case errorTypes.CREATE_COMMENT_FAIL:
      status = 500;
      message = '创建评论失败~'
    break;
    case errorTypes.UPLOAD_PICTURE_FAIL:
      status = 400;
      message = '图片上传失败~'
    break;
    case errorTypes.UPLOAD_AVATAR_FAIL:
      status = 400;
      message = '头像上传失败~'
    break;
    case errorTypes.GET_PICTURE_FAIL:
      status = 400;
      message = '获取图片失败~'
    break;
    case errorTypes.GET_MY_MOMENT_LIST:
      status = 400;
      message = '获取我的动态失败~'
    break;
    case errorTypes.UPDATE_USER_INFO:
      status = 400;
      message = '修改个人信息失败~'
    break;
    default:
      status = 404;
      message = 'NOT FOUND';
  }
  ctx.status = status;
  ctx.body = message;
}

module.exports = errorHandler;