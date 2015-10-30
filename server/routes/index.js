var express = require('express');
var router = express.Router();
// 通过第三方API进行号码合法性检测
var checkTheTel = require('../func/checkTheTel');
var createTheMoney = require('../func/createTheMoney');
var getTheClientIP = require('../func/getTheClientIP');
// 将通过检测的号码存在表中，抢红包时验证号码是否在这张表中，从而规避掉直接通过接口抢红包
var checkTheNum = require('../database/checkTheNum');
var User = require('../database/userTable');

router.post('/tel', function(req, res, next) {
    // get请求，数据存在于query中
    // post请求，数据存在于body中
    // 获取clientIP
    var clientIP = getTheClientIP(req.ip);
    var tel = req.body.tel;
    checkTheTel(tel, function(obj) {
        // 进行数据库插入操作
        checkTheNum.findOrCreate({
            where: {
                // 将字符串转换为数字
                tel: +tel,
                clientIP : clientIP
            }
        }).spread(function(user, created) {
            // 若数据存在，则created为false
            res.json({
                success: obj.success
            });
        });
    });
});

router.post('/grab', function(req, res, next) {
    // get请求，数据存在于query中
    // post请求，数据存在于body中
    // 获取clientIP
    var clientIP = getTheClientIP(req.ip);
    console.log(clientIP);
    var tel = req.body.tel;
    // 将字符串转为数字
    tel = +tel;
    // 拿到号码后，先随机生成抢到的金额
    var money = createTheMoney();
    // 先判断号码是否存在checkTheNum中
    checkTheNum.findOne({
        where: {
            tel: tel
        }
    }).then(function(user) {
        if (user) {
            // 如果存在表checkTheNum中，则进行抢红包操作
            User.findOrCreate({
                    where: {
                        tel: tel
                    },
                    defaults: {
                        money: money
                    }
                })
                .spread(function(user, created) {
                    res.json(user.get({
                        plain: true
                    }));
                })
        }else{
            res.json({come : 'baby'});
        }
    });
});

module.exports = router;
