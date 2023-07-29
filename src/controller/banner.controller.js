const {
  GET_BANNER_LIST_FAIL,
  UPLOAD_PICTURE_FAIL,
} = require("../constants/error-types");
const fileService = require("../service/file.service");
class BannerController {
  // 获取轮播图列表
  async list(ctx, next) {
    try {
      const result = await fileService.getBannerList();
      ctx.body = {
        code: 200,
        message: "success",
        data: result,
      };
    } catch (err) {
      console.log("获取轮播图列表失败", err);
      const error = new Error(GET_BANNER_LIST_FAIL);
      ctx.app.emit("error", error, ctx);
    }
  }

  async saveBannerPictureInfo(ctx, next) {
    const files = ctx.req.files;
    const { id } = ctx.user;
    try {
      for (let file of files) {
        const { mimetype, size, filename } = file;
        await fileService.createPictureInfo(
          filename,
          mimetype,
          size,
          id,
          "banner"
        );
      }
      ctx.body = {
        code: 200,
        message: "图片上传成功",
      };
    } catch (err) {
      console.log("上传图片失败", err);
      const error = new Error(UPLOAD_PICTURE_FAIL);
      ctx.app.emit("error", error, ctx);
    }
  }
}
module.exports = new BannerController();
