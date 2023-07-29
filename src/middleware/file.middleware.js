const Multer = require('koa-multer');
const Jimp = require('jimp');
const path = require('path');
const {
  AVATAR_PATH,
  PICTURE_PATH,
  BANNER_PATH
} = require('../constants/file-path')

// 用户头像
const avatarUpload = Multer({
  dest: AVATAR_PATH
})
const avatarHandler = avatarUpload.single('avatar');

// 动态图片
const pictureUpload = Multer({
  dest: PICTURE_PATH
})
const pictureHandler = pictureUpload.array('picture', 9);


const pictureResize = async (ctx, next) => {
  // 1. 获取所有的图像信息
  const files = ctx.req.files;
  for( let file of files ) {
    const destPath = path.join(file.destination, file.filename);
    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`)
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`)
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
      image.write(`${destPath}`)
    })
  }
  await next()
}
module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}