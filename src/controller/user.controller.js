const fs = require('fs');
const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const {
  AVATAR_PATH
} = require('../constants/file-path')
const { UPLOAD_AVATAR_FAIL } = require('../constants/error-types');
class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;

    // 查询数据
    const result = await userService.create(user);
    // 返回数据
    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    const { userId } = ctx.params;
    const avatarInfo = await fileService.getAvatarByUserId(userId);
    ctx.response.set('content-type', avatarInfo.mimetype);
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }

  // 保存头像信息
  async saveAvatarInfo(ctx, next) {
    const {filename, mimetype, size} = ctx.req.file;
    const { id } = ctx.user;
    // 是否存在头像
    let isExists = await userService.getUserAvatarById(id);
    try {
      if (isExists) {
        // 更新头像
        await userService.updateAvatarTableAvatarUrlById(filename, mimetype, size, id)
      } else {
        // 创建头像
        await fileService.createAvatar(filename, mimetype, size, id)
      }
      ctx.body = {
        code: 200,
        message: '上传头像成功'
      };
    } catch(err) {
      console.log('上传头像错误', err);
      const error = new Error(UPLOAD_AVATAR_FAIL)
      ctx.app.emit('error', error, ctx);
    }
  }

  
  // 修改个人信息
  async update(ctx, next) {
    const {id} = ctx.user;
    const { name } = ctx.request.body;
    try {
      await userService.update(name, id);
      ctx.body = {
        code: 200,
        data: {
          id,
          name
        },
        message: '更新成功~'
      }
    } catch(err) {
      const error = new Error(UPDATE_USER_INFO);
      ctx.app.emit('error', error, ctx);
      console.log('修改信息失败', err);
    }
  }
}

module.exports = new UserController();