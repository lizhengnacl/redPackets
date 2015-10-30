// 创建User表格

var Sequelize = require('sequelize');
var sequelize = require('./sequelize');

var checkTheNum = sequelize.define('checkTheNum', {
    tel : {
        type : Sequelize.BIGINT(11),
        unique : true
    },
    clientIP : {
        type : Sequelize.STRING
        // validate : {
        //     isIP: true
        // }
    }
}, {
    freezeTableName : true,
    timestamps: false,
})

checkTheNum.sync({force : true});
// module.exports = checkTheNum;
