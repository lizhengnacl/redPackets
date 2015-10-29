// 废弃掉

// 添加用户
// 判断数据有效性后进行数据查询
// 存在 返回值
// 不存在 添加

var User = require('./CreateUserTable');

function createUser(tel, money, cb) {
    User.create({
        username: tel,
        money: money
    }).then(function() {
        cb();
    });
}

module.exports = createUser;
