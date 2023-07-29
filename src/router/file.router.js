const Router = require('koa-router');
const {
  pictureHandler,
  pictureResize
} = require('../middleware/file.middleware');

const {
  verifyAuth
} = require('../middleware/auth.middleware');

const {
  savePictureInfo,
  fileInfo
} = require('../controller/file.controller');
const fileRouter = new Router({ prefix: '/file' });

// 上传图片
fileRouter.post('/upload', verifyAuth, pictureHandler, pictureResize, savePictureInfo);

// 获取图片
fileRouter.get('/img/:filename', fileInfo);
module.exports = fileRouter;