

const connection = require('../app/database');

class UserService {
  async create(user) {
    const { name, password } = user;
    const statement = `INSERT INTO user (name, password) VALUES (?, ?);`;
    const result = await connection.execute(statement, [name, password]);
    // 将user存储到数据库中
    return result[0];
  }

  async update(name, id) {
    const statement = `UPDATE user SET name = ? WHERE id = ?;`;
    const result = await connection.execute(statement, [name, id]);
    return result[0];
  }

  async getUserByName (name) {
    const statement = `SELECT * FROM user WHERE name = ?;`;
    const result = await connection.execute(statement, [name]);

    return result[0];
  }

  async getUserAvatarById(id) {
    const statement = `SELECT * FROM avatar WHERE avatar.user_id = ?;`
    const [result] = await connection.execute(statement, [id]);
    return result[0] ? true : false;
  }

  async updateAvatarTableAvatarUrlById(filename, mimetype, size, userId) {
    const statement = `UPDATE avatar SET filename = ?, size = ?, mimetype = ? WHERE user_id = ?;`
    const [result] = await connection.execute(statement, [filename, size, mimetype, userId]);
    return result;
  }
}

module.exports = new UserService();