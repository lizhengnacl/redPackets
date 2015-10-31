// 创建数据库连接

var Sequelize = require('sequelize');
var sequelize = new Sequelize('redPackets', 'root', 'lz19910624', {
    host: 'localhost',
    dialect: 'mysql',
    // 去掉日志
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;
