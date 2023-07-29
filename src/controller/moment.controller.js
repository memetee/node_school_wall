const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');
const fs = require('fs');
const {
  PICTURE_PATH
} = require('../constants/file-path');
const { ADD_COLLECT_MOMENT_FAIL, CREATE_MOMENT_FAIL, GET_MOMENT_FAIL, GET_MOMENT_LIST_HOT, GET_MOMENT_LIST_ALL } = require('../constants/error-types');
class MomentController {
  // 创建动态
  async create(ctx, next) {
    const userId = ctx.user.id;
    const { content, label } = ctx.request.body;
    try {
      await momentService.create(userId, content, label);
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch(err) {
      console.log('创建动态失败', err);
      const error = new Error(CREATE_MOMENT_FAIL);
      ctx.app.emit('error', error, ctx);
    }
  }

  // 获取动态详情
  async detail(ctx, next) {
    const { momentId } = ctx.params;
    const {id} = ctx.user;
    try {
      const result = await momentService.getMomentById(id, momentId);
      ctx.body = {
        code: 200,
        message: 'success',
        data: result
      };
    } catch(err) {
      console.log('获取动态详情错误', err);
      const error = new Error(GET_MOMENT_FAIL);
      ctx.app.emit('error', error, ctx);
    }
  }

  // 获取全部动态列表
  async allList(ctx, next) {
    let offset = '0';
    let size = '10';
    if (ctx.query.offset) offset = ctx.query.offset;
    if (ctx.query.size) size = ctx.query.size;
    try {
      const result = await momentService.getMomentAllList(offset, size);
      ctx.body = {
        data: result,
        code: 200,
        message: 'success'
      };
    }catch(err) {
      console.log('获取动态所有列表错误打印', err);
      const error = new Error(GET_MOMENT_LIST_ALL)
      ctx.app.emit('error', error, ctx);
    }
  }
  // 获取热门动态列表
  async hotList(ctx, next) {
    const { offset, size } = ctx.query;
    try {
      const result = await momentService.getMomentHotList(offset, size);
      ctx.body = {
        data: result,
        code: 200,
        message: 'success'
      };
    } catch(err) {
      console.log('获取热门列表错误打印', err);
      const error = new Error(GET_MOMENT_LIST_HOT)
      ctx.app.emit('error', error, ctx);
    }
  }










  // 更新动态内容
  async update(ctx, next) {
    // 获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    const { id } = ctx.user;

    // 修改内容
    const result = await momentService.update(content, momentId)

    ctx.body = result;
  }

  // 删除动态
  async remove(ctx, next) {
    const { momentId } = ctx.params;
    const [result] = await momentService.remove(momentId);

    ctx.body = result;
  }

  // 新增标签
  async addLabels(ctx, next) {
    const { labels } = ctx;
    const { momentId } = ctx.params;

    for(let label of labels) {
      // 2.1.判断标签是否已经和动态有关系
      const isExist = await momentService.isExistLabel(momentId, label.id);
      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }
    ctx.body = '给动态添加标签成功~'
  }

  async handleCollect(ctx, next) {
    const { momentId } = ctx.params;
    const { id } = ctx.user;
    const { collect } = ctx.request.body;
    const primaryKey = id + 'm' + momentId;
    try {
      if (collect) {
        await momentService.addCollect(primaryKey, momentId, id);
      } else {
        await momentService.delCollect(momentId, id);
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
}

module.exports = new MomentController();