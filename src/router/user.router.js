


const Router = require('koa-router');
const userRouter = new Router({prefix: '/user'});
const {
  create,
  avatarInfo,
  saveAvatarInfo,
  update
} = require('../controller/user.controller')
const {
  verifyUser,
  handlePassword
} = require('../middleware/user.midddleware');
const { verifyAuth } = require('../middleware/auth.middleware');
const { avatarHandler } = require('../middleware/file.middleware');

// 注册用户
userRouter.post('/', verifyUser, handlePassword, create);

// 上传用户头像
userRouter.post('/avatar/upload', verifyAuth, avatarHandler, saveAvatarInfo);

// 获取用户头像
userRouter.get('/avatar/:userId', avatarInfo)

// 修改信息
userRouter.put('/update', verifyAuth, update);

module.exports = userRouter;
