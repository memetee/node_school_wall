const Router = require('koa-router');
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');
const {
  create,
  reply,
  update,
  remove,
  list,
  detail,
  secondList,
  handleCollect
} = require('../controller/comment.controller.js');

const commentRouter = new Router({prefix: '/comment'});
commentRouter.post('/', verifyAuth, create);

// 获取一级评论详情
commentRouter.get('/detail/:commentId', verifyAuth, detail),

// 修改一级评论
commentRouter.patch('/:commentId', verifyAuth, verifyPermission('comment'), update);

// 删除一级评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission('comment'), remove);

// 获取一级评论列表
commentRouter.get('/', list);

// 收藏/取消收藏评论
commentRouter.post('/collect/:commentId', verifyAuth, handleCollect);


// 创建二级评论
commentRouter.post('/reply/:commentId', verifyAuth, reply);

// 获取二级评论列表
commentRouter.get('/list/:commentId', verifyAuth, secondList);


module.exports = commentRouter;