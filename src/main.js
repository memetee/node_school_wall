const app = require('./app');
const config = require('./app/config');


const connections = require('./app/database.js');



app.listen(config.APP_PORT, () => {
  console.log(`服务器启动在${config.APP_PORT}端口`);
})