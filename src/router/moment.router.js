const Router = require('koa-router');
const {
  create,
  detail,
  allList,
  update,
  remove,
  addLabels,
  hotList,
  handleCollect
} = require('../controller/moment.controller.js');
const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  verifyLabelExists
} = require('../middleware/label.middleware')

const momentRouter = new Router({prefix: '/moment'});

// 创建动态
momentRouter.post('/', verifyAuth, create);

// 所有列表
momentRouter.get('/allList', allList);

// 热点列表
momentRouter.get('/hotList', hotList);

// 动态详情
momentRouter.get('/:momentId', verifyAuth, detail);

// 添加/取消收藏动态
momentRouter.post('/collect/:momentId', verifyAuth, handleCollect)


/**
 * 管理后台接口
 */

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission('moment'), verifyLabelExists,  addLabels);

// 修改评论
momentRouter.patch('/:momentId', verifyAuth, verifyPermission('moment'), update);

// 删除评论
momentRouter.delete('/:momentId', verifyAuth, verifyPermission('moment'), remove);


module.exports = momentRouter;