
const connection = require('../app/database')
const {APP_FILE_HOST, APP_PORT} = require('../app/config')

class CommentService{
  async create(momentId, content, userId) {
    const statement = `INSERT INTO comment(content, moment_id, user_id) VALUES (?, ?, ?);`
    const [result] = await connection.execute(statement, [content, momentId, userId]);
    return result;
  }
  async reply(momentId, content, userId, commentId) {
    const statement = `
      INSERT INTO comment(content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?);
    `
    const [result] = await connection.execute(statement, [content, momentId, userId, commentId]);
    return result;
  }
  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?`;
    const [result] = await connection.execute(statement, [content, commentId])
    return result;
  }
  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [commentId])
    return result;
  }
  async getCommentsByMomentId(momentId) {
    const statement = `SELECT
        m.id, m.content, m.comment_id commentId, m.createAt createTime,
        JSON_OBJECT('id', u.id, 'name', u.name) user
        FROM comment m
        LEFT JOIN user u ON u.id = m.user_id
      WHERE moment_id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }
  async getSecondCommentListByCommentId(commentId) {
    const statement = `SELECT * FROM comment WHERE comment.comment_id = ?;`;
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }
  async getCommentDetailByCommentId(userId, commentId) {
    const statement = `
    SELECT 
      m.id id, 
      m.content content, 
      m.createAt createTime, 
      m.updateAt updateTime, 
      JSON_OBJECT('id', u.id, 'name', u.name, 'url', CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', u.id)) author,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      IF(COUNT(l.id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL) labels, 
      EXISTS(SELECT 1 FROM collect WHERE collect.user_id = ? AND collect.moment_id = m.id) isFavorite,
      (SELECT 
        JSON_ARRAYAGG(
          JSON_OBJECT('commentId', c.id, 'content', c.content, 'createTime', c.createAt, 
            'author', JSON_OBJECT('id', cu.id, 'name', cu.name, 'url', CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', cu.id)),
            'isFavorite', EXISTS(SELECT 1 FROM collect WHERE collect.user_id = 4 AND collect.comment_id = c.id),
            'replyTo',(SELECT JSON_OBJECT('id', u1.id, 'name', u1.name) FROM comment c1
              LEFT JOIN user u1 ON u1.id = c1.user_id
              WHERE c1.id = c.comment_id
            )
          )
        )
        FROM comment c 
        LEFT JOIN user cu ON c.user_id = cu.id 
        WHERE m.id = c.moment_id
      ) comments, 
      (SELECT JSON_ARRAYAGG(CONCAT('${APP_FILE_HOST}:${APP_PORT}/file/img/', mi.filename))
        FROM moment_images mi WHERE m.id = mi.moment_id) images,
      ) images 
    FROM moment m 
    LEFT JOIN user u ON m.user_id = u.id 
    LEFT JOIN moment_label ml ON m.id = ml.moment_id 
    LEFT JOIN label l ON ml.label_id = l.id 
    WHERE m.id = ?;`
    const [result] = await connection.execute(statement, [userId, commentId]);
    return result[0];
  }

    // 收藏评论
    async addCollect(primaryKey, userId, commentId) {
      const statement = `INSERT INTO collect (id, comment_id, user_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, comment_id = ?, user_id = ?;`
      const [result] = await connection.execute(statement, [primaryKey, commentId, userId, primaryKey, commentId, userId]);
      return result;
    }

    // 取消收藏
    async delCollect(userId, commentId) {
      const statement = `DELETE FROM collect WHERE comment_id = ? AND user_id = ?;`
      const [result] = await connection.execute(statement, [commentId, userId]);
      return result;
    }
}


module.exports = new CommentService();