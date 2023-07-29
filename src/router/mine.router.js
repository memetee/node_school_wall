const Router = require('koa-router');
const { verifyAuth } = require('../middleware/auth.middleware');
const { handleMyMoment, handleMyCollect, handleAdvice } = require('../controller/mine.controller');

const mineRouter = new Router({prefix: '/mine'});

// 获取我的关注列表
mineRouter.get('/myMomentList', verifyAuth, handleMyMoment)

// 获取我的收藏列表
mineRouter.get('/myCollectList', verifyAuth, handleMyCollect);

// 提交建议
mineRouter.post('/advice', verifyAuth,  handleAdvice);

module.exports = mineRouter;