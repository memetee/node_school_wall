const connections = require("../app/database");
const {APP_FILE_HOST, APP_PORT} = require('../app/config')

class MineService {
  async getMyMomentList(userId, offset, size) {
    const statement = `
    SELECT
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, m.hot hot,
      JSON_OBJECT('id', u.id, 'name', u.name, 'url',
        (SELECT IF(u.id, CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', u.id),NULL)
        FROM avatar
        WHERE u.id = avatar.user_id)) author,
      (SELECT COUNT(*) FROM comment c  WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml  WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT('${APP_FILE_HOST}:${APP_PORT}/file/img/', mi.filename))
        FROM moment_images mi WHERE m.id = mi.moment_id) images,
      (SELECT
        IF(l.id, JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL)
        FROM moment_label ml
        LEFT JOIN label l ON ml.label_id = l.id
        WHERE m.id = ml.moment_id) labels
    FROM moment m
    LEFT JOIN user u ON m.user_id = u.id
    WHERE m.user_id = ?
    ORDER BY m.createAt DESC
    LIMIT ?, ?;
  `;
    const result = await connections.execute(statement, [userId, offset, size]);
    return result[0];
  }

  // 获取我的关注
  async getMyCollectList(userId, offset, size) {
    const statement = `
      SELECT
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime, m.hot hot,
        JSON_OBJECT('id', u.id, 'name', u.name, 'url',
          (SELECT IF(u.id, CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', u.id),NULL)
          FROM avatar
          WHERE u.id = avatar.user_id)) author,
        (SELECT COUNT(*) FROM comment c  WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml  WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('${APP_FILE_HOST}:${APP_PORT}/file/img/', mi.filename))
          FROM moment_images mi WHERE m.id = mi.moment_id) images,
        (SELECT
          IF(l.id, JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL)
          FROM moment_label ml
          LEFT JOIN label l ON ml.label_id = l.id
          WHERE m.id = ml.moment_id) labels
      FROM collect
      LEFT JOIN moment m ON collect.moment_id = m.id
      LEFT JOIN user u ON m.user_id = u.id
      WHERE collect.user_id = ? AND collect.moment_id IS NOT NULL
      LIMIT ?, ?;
    `;
    const result = await connections.execute(statement, [userId, offset, size]);
    return result[0];
  }

  async createAdvice(userId, content, contactInformation) {
    const statement = `INSERT INTO advice (user_id, content, contact_information) VALUES (?, ?, ?);`
    const [result] = await connections.execute(statement, [userId, content, contactInformation]);
    return result;
  }
}

module.exports = new MineService();
