const { createPool, getConnection } = require('./database/connect-database');
// 创建连接
let connections = createPool();

// 检测数据库是否连接成功（没有数据库将会创建数据库)
getConnection(connections);


module.exports = connections.promise();