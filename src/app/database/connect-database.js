
const mysql = require('mysql2');
const config = require('../config');
const fs = require('fs');
const path = require('path');
// 创建连接池
function createPool() {
    return mysql.createPool({
        host: config.MYSQL_HOST,
        port: config.MYSQL_PORT,
        database: config.MYSQL_DATABASE,
        user: config.MYSQL_USER,
        password: config.MYSQL_PASSWORD
    })
}

function getConnection(connections) {
    // 测试是否链接上了数据库
    connections.getConnection((err, conn) => {
        // 数据库不存在
        if (err) {
            console.log('数据库不存在，开始创建数据库...');
            let newConnections = mysql.createPool({
                host: config.MYSQL_HOST,
                port: config.MYSQL_PORT,
                user: config.MYSQL_USER,
                password: config.MYSQL_PASSWORD,
                multipleStatements: true
            })
            console.log('读取sql文件...')
            let sqlFile = '';
            try {
                sqlFile = fs.readFileSync(path.resolve(__dirname, './sql-file.sql'), 'utf-8');
            } catch(err) {
                console.log('读取sql文件失败...')
            }
            console.log('开始执行sql语句...')
            newConnections.query(sqlFile, (err, result) => {
                if (err) {
                    console.log('sql语句执行失败...', err);
                } else {
                    console.log('sql语句执行成功...')
                    // 测试是否连接上了数据库
                    console.log('测试连接新的数据库...')
                    getConnection(connections);
                }
            })
        } else {
            // 数据库存在，是否连接成功
            conn.connect((err) => {
                if (err) {
                    console.log('数据库链接失败', err)
                } else {
                    console.log('数据库链接成功');
                }
            })
        }
    })
}

module.exports = {
    createPool,
    getConnection
}
