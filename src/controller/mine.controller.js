const { GET_MY_MOMENT_LIST } = require("../constants/error-types");
const mineService = require("../service/mine.service");

class Mine {
  async handleMyMoment(ctx, next) {
    const { id } = ctx.user;
    const {offset = 0, size = 10} = ctx.query;
    try {
      const result = await mineService.getMyMomentList(id, offset, size);
      ctx.body = {
        code: 200,
        message: '获取我的动态成功~',
        data: result
      }
    } catch(err) {
      console.log('获取我的动态失败', err);
      const error = new Error(GET_MY_MOMENT_LIST)
      ctx.app.emit('error', error, ctx);
    }
  }

  async handleMyCollect(ctx, next) {
    const { id } = ctx.user;
    const {offset = 0, size = 10} = ctx.query;
    try {
      const result = await mineService.getMyCollectList(id, offset, size);
      ctx.body = {
        code: 200,
        message: '获取我的动态成功~',
        data: result
      }
    } catch(err) {
      console.log('获取我的动态失败', err);
      const error = new Error(GET_MY_MOMENT_LIST)
      ctx.app.emit('error', error, ctx);
    }
  }

  async handleAdvice(ctx, next) {
    const {id} = ctx.user;
    const {content, contact} = ctx.request.body;
    try {
      await mineService.createAdvice(id, content, contact);
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch(err) {
      console.log('失败', err);
    }
  }
}

module.exports = new Mine();