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
    if(tel.length !== 11){
        res.json({
            success: 0
        });
    }
    checkTheTel(tel, function(obj) {
        // 进行数据库插入操作
        checkTheNum.findOrCreate({
            where: {
                // 将字符串转换为数字
                tel: +tel
            }
        }).spread(function(user, created) {
            // 若数据存在，则created为false
            if (!user.clientIP) {
                user.update({
                    clientIP: clientIP
                });
            }
            res.json({
                success: obj.success
            });
        });
    });
});

router.post('/grab', function(req, res, next) {
    var clientIP = getTheClientIP(req.ip);
    var tel = req.body.tel,
        hrefTel = req.body.hrefTel;
    tel = +tel;

    function handleTel(tel) {
        checkTheNum.findOne({
            where: {
                tel: tel
            }
        }).then(function(user) {
            // 一定有，检查号码正确性时插入了
            if (user) {
                User.findOrCreate({
                        where: {
                            tel: tel
                        }
                    })
                    .spread(function(user, created) {
                        if (user.money !== 200 && user.money !== 100) {
                            user.update({
                                money: 100
                            }).then(function(user) {
                                res.json(user.get({
                                    plain: true
                                }));
                            });
                        } else {
                            res.json(user.get({
                                plain: true
                            }));
                        }
                    })
            }
        });
    }
    function handleHrefTel(hrefTel) {
        checkTheNum.findOne({
            where: {
                tel: hrefTel
            }
        }).then(function(user) {
            // 一定有，检查号码正确性时插入了
            if (user) {
                User.findOrCreate({
                        where: {
                            tel: hrefTel
                        }
                    })
                    .spread(function(user, created) {
                        if (user.money !== 200) {
                            user.update({
                                money: 200
                            });
                        }
                    })
            }
        });
    }
    handleTel(tel);
    if (hrefTel.length > 0 && hrefTel !== tel) {
        handleHrefTel(hrefTel);
    }
});

module.exports = router;
