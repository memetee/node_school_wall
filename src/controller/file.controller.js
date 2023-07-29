const fileService = require('../service/file.service');
const { UPLOAD_PICTURE_FAIL, GET_PICTURE_FAIL } = require('../constants/error-types');
const fs = require('fs');
const { PICTURE_PATH } = require('../constants/file-path');
class FileController {
  async savePictureInfo(ctx, next) {
    const files = ctx.req.files;
    const { id } = ctx.user;
    try {
      for (let file of files) {
        const { mimetype, size, filename } = file;
        await fileService.createPictureInfo(filename, mimetype, size, id);
      }
      ctx.body = {
        code: 200,
        message: '图片上传成功'
      };
    } catch(err) {
      console.log('上传图片失败', err)
      const error = new Error(UPLOAD_PICTURE_FAIL)
      ctx.app.emit('error', error, ctx);
    }
  }

  async fileInfo(ctx, next) {
    try{
      let { filename } = ctx.params;
      const fileInfo = await fileService.getFileByFileName(filename);
      const { type } = ctx.query;
      const types = ['small', 'middle', 'large'];
      if (types.some(item => item === type)) {
        filename = filename + '-' + type
      }
      ctx.response.set('content-type', fileInfo.mimetype);
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    }catch(err) {
      console.log('获取图片失败', err);
      const error = new Error(GET_PICTURE_FAIL);
      ctx.app.emit('error', error, ctx);
    }
  }
}

module.exports = new FileController();