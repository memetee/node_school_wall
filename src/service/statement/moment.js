const {APP_FILE_HOST, APP_PORT} = require('../../app/config')

const create = "INSERT INTO `moment` (content, user_id) VALUES (?, ?);";
const createMomentAndLabel = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
const detail = `
  SELECT 
    m.id id, 
    m.content content, 
    m.createAt createTime, 
    m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name, 'url', CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', u.id)) author, 
    (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
    IF(COUNT(l.id), JSON_ARRAYAGG(JSON_OBJECT('id', l.id, 'name', l.name)), NULL) labels,
    EXISTS(SELECT 1 FROM collect WHERE collect.user_id = ? AND collect.moment_id = m.id) isFavorite,
    (SELECT JSON_ARRAYAGG(
        JSON_OBJECT('commentId', c.id, 'content', c.content, 'createTime', c.createAt,
          'author', JSON_OBJECT('id', cu.id, 'name', cu.name, 'url', CONCAT('${APP_FILE_HOST}:${APP_PORT}/user/avatar/', u.id)),
          'isFavorite', EXISTS(SELECT 1 FROM collect
            WHERE collect.user_id = ? AND collect.comment_id = c.id),
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
      FROM moment_images mi WHERE m.id = mi.moment_id) images 
  FROM moment m 
  LEFT JOIN user u ON m.user_id = u.id 
  LEFT JOIN moment_label ml ON m.id = ml.moment_id 
  LEFT JOIN label l ON ml.label_id = l.id 
  WHERE m.id = ?;`;
const allList = `
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
  ORDER BY
  m.id DESC
  LIMIT ?, ?;
`;
const hotList = `
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
ORDER BY
  m.hot DESC
LIMIT ?, ?;
`;
const addCollect = `INSERT INTO collect (id, moment_id, user_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = ?, moment_id = ?, user_id = ?;`;
const delCollect = `DELETE FROM collect WHERE moment_id = ? AND user_id = ?;`;





const update = `UPDATE moment SET content = ? WHERE id = ?;`;
const remove = `DELETE FROM moment where id = ?;`;
const isExistLabel = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
const addLabel = `INSERT INTO moment_label(moment_id, label_id) VALUES (?, ?);`;
module.exports = {
  create,
  detail,
  allList,
  hotList,
  update,
  remove,
  isExistLabel,
  addLabel,
  addCollect,
  delCollect,
  createMomentAndLabel
};
