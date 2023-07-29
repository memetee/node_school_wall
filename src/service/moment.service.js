const connection = require('../app/database');
const momentStatement = require('./statement/moment');
class MomentService {

  // 创建动态
  async create(userId, content, labelId) {
    const statement1 = momentStatement.create;
    const statement2 = momentStatement.createMomentAndLabel;

    // 插入动态表
    const [result] = await connection.execute(statement1, [content, userId]);
    // 插入动态/标签关系表
    await connection.execute(statement2, [result.insertId, labelId]);
  }

  // 获取动态详情
  async getMomentById(userId, momentId) {
    const statement= momentStatement.detail
    const [result] = await connection.execute(statement, [userId, userId, momentId]);
    return result[0];
  }

  // 获取列表
  async getMomentAllList(offset, size) {
    // 子查询评论数量
    const statement = momentStatement.allList;
    const result = await connection.execute(statement, [offset, size])
    return result[0];
  }

  // 获取热门列表
  async getMomentHotList(offset, size) {
    // 子查询评论数量
    const statement = momentStatement.hotList;
    const result = await connection.execute(statement, [offset, size])
    return result[0];
  }

  // 收藏动态
  async addCollect(primaryKey, momentId, userId) {
    const statement = momentStatement.addCollect;
    const [result] = await connection.execute(statement, [primaryKey, momentId, userId, primaryKey, momentId, userId]);
    return result;
  }

  // 取消收藏
  async delCollect(momentId, userId) {
    const statement = momentStatement.delCollect;
    const [result] = await connection.execute(statement, [momentId, userId]);
    return result;
  }






  // 更新动态内容
  async update (content, momentId) {
    const statement = momentStatement.update;
    const [result] = await connection.execute(statement, [content, momentId])
    return result;
  }

  // 删除动态
  async remove(id) {
    const statement = momentStatement.remove;
    const result = await connection.execute(statement, [id])
    return result;
  }
  
  // 标签是否存在
  async isExistLabel(momentId, labelId) {
    const statement = momentStatement.isExistLabel;
    const [ result ] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  // 新增标签
  async addLabel(momentId, labelId) {
    const statement = momentStatement.addLabel;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }


}

module.exports = new MomentService();