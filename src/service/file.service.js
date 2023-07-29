
const connection = require('../app/database');
const {APP_FILE_HOST, APP_PORT} = require('../app/config')

class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId])
    return result;
  }
  
  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result[0];
  }

  // 获取图片
  async getFileByFileName(filename) {
    const statement = `SELECT * FROM file WHERE name = ?;`;
    const [result] = await connection.execute(statement, [filename]);
    return result[0];
  }

  // 创建图片信息
  async createPictureInfo(name, mimetype, size, userId, type) {
    let statement = '';
    let result = ''
    if (!type) {
      statement = `INSERT INTO file (name, mimetype, size, user_id) VALUES (?, ?, ?, ?);`
      result = await connection.execute(statement, [name, mimetype, size, userId]);
    } else {  // 轮播图
      statement = `INSERT INTO file (name, mimetype, size, user_id, type) VALUES (?, ?, ?, ?, ?);`
      result = await connection.execute(statement, [name, mimetype, size, userId, type]);
    }
    return result[0];
  }

  // 获取轮播图列表
  async getBannerList() {
    const statement = `
    SELECT
      file.user_id userId,
      file.name name,
      CONCAT('${APP_FILE_HOST}:${APP_PORT}/file/img/',file.name) url,
      file.createAt createAt,
      file.updateAt updateAt
    FROM file WHERE type = 'banner';`;
    const result = await connection.execute(statement);
    return result[0];
  }
}

module.exports = new FileService();