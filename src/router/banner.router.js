const Router = require('koa-router');
const { verifyAuth } = require('../middleware/auth.middleware');
const { pictureHandler, pictureResize } = require('../middleware/file.middleware');
const { list, saveBannerPictureInfo } = require('../controller/banner.controller');

const bannerRouter = new Router({prefix: '/banner'});
// 上传轮播图
bannerRouter.post('/upload', verifyAuth, pictureHandler, pictureResize, saveBannerPictureInfo);

// 获取轮播图列表
bannerRouter.get('/', list);


module.exports = bannerRouter;