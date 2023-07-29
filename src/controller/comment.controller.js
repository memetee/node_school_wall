

const { CREATE_COMMENT_FAIL } = require('../constants/error-types.js');
const service = require('../service/comment.service.js');
class CommentController {
  // 创建评论
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;
    try {
      await service.create(momentId, content, id);
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch(err) {
      console.log('创建评论失败');
      const error = new Error(CREATE_COMMENT_FAIL)
      ctx.app.emit('error', error, ctx);
    }
  }






  // 获取评论详情
  async detail(ctx, next) {
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    try {
      const result = await service.getCommentDetailByCommentId(id, commentId);
      ctx.body = {
        code: 200,
        message: 'success',
        data: result
      }
    } catch(err) {
    }
  }
  // 更新评论
  async update (ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await service.update(commentId, content)
    ctx.body = result
  }

  // 删除评论
  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await service.remove(commentId)
    ctx.body = result;
  }

  // 获取评论列表
  async list(ctx, next) {
    const { momentId } = ctx.query;
    const result = await service.getCommentsByMomentId(momentId);
    ctx.body = result;
  }

  async handleCollect(ctx, next) {
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    const { collect } = ctx.request.body;
    const primaryKey = id + 'c' + commentId;
    try {
      if (collect) {
        await service.addCollect(primaryKey, id, commentId);
      } else {
        await service.delCollect(id, commentId);
      }
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch(err) {
      console.log('新增收藏失败', err)
      const error = new Error(ADD_COLLECT_MOMENT_FAIL)
      ctx.app.emit('error', error, ctx);
    }
  }
  // 创建二级评论
  async reply(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;
    const { commentId } = ctx.params;
    const result = await service.reply(momentId, content, id, commentId);
    ctx.body = {
      code: 200,
      message: 'success'
    };
  }

  // 获取二级评论列表
  async secondList(ctx, next) {
    const {commentId} = ctx.params;
    const result = await service.getSecondCommentListByCommentId(commentId);
    ctx.body = {
      code: 200,
      data: result,
      message: 'success'
    }
  }
}


module.exports = new CommentController();