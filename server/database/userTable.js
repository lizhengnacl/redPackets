// 创建User表格

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var User = sequelize.define('user', {
    tel : {
        type : Sequelize.BIGINT(11),
        unique : true
    },
    money : Sequelize.INTEGER
}, {
    freezeTableName : true
})

// User.sync();
module.exports = User;
