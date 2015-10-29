// 创建User表格

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var checkTheNum = sequelize.define('checkTheNum', {
    tel : {
        type : Sequelize.BIGINT(11),
        unique : true
    }
}, {
    freezeTableName : true
})

// checkTheNum.sync();
module.exports = checkTheNum;
