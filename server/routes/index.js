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
    console.log(clientIP);
    var tel = req.body.tel;
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
    // get请求，数据存在于query中
    // post请求，数据存在于body中
    // 获取clientIP
    var clientIP = getTheClientIP(req.ip);
    // 现在传递过来的数据为一个数组，看看如何接受
    var tel = req.body.tel,
        hrefTel = req.body.hrefTel;
    // 将字符串转为数字
    tel = +tel;
    // 先判断号码是否存在checkTheNum中
    function createUser(tel, returnTheResponse) {
        checkTheNum.findOne({
            where: {
                tel: tel,
                clientIP: clientIP
            }
        }).then(function(user) {
            if (user) {
                // 如果存在表checkTheNum中，则进行User中进行抢红包操作
                User.findOrCreate({
                        where: {
                            tel: tel
                        }
                    })
                    .spread(function(user, created) {
                        if (created) {
                            user.update({
                                money: 100
                            }).then(function(user) {
                                if (returnTheResponse) {
                                    res.json(user.get({
                                        plain: true
                                    }));
                                }
                            });
                        } else {
                            if (returnTheResponse) {
                                res.json(user.get({
                                    plain: true
                                }));
                            }
                        }
                    })
            } else {
                User.findOrCreate({
                        where: {
                            tel: tel
                        }
                    })
                    .spread(function(user, created) {
                        if (!created) {
                            user.update({
                                money: 200
                            }).then(function(user) {
                                if (returnTheResponse) {
                                    res.json(user.get({
                                        plain: true
                                    }));
                                }
                            });
                        } else {
                            if (returnTheResponse) {
                                res.json(user.get({
                                    plain: true
                                }));
                            }
                        }
                    })
            }
        });
    }
    createUser(tel, true);
    // 此处有个小技巧，res.json只有第一个起作用，后续的因为链接关闭了所以无效的，可以不用处理
    if (hrefTel.length > 0) {
        createUser(hrefTel, false);
    }
});

router.post('/getTheUpdatedMoney', function(req, res, next) {
    var tel = req.body.tel;
    checkTheTel(tel, function(obj) {
        // 进行数据库插入操作
        checkTheNum.findOrCreate({
            where: {
                // 将字符串转换为数字
                tel: +tel
            }
        }).spread(function(user, created) {
            if (user) {
                User.findOne({
                    where: {
                        tel: tel
                    }
                }).then(function(user) {
                    res.json(user.get({
                        plain: true
                    }));
                })
            } else {
                res.end();
            }

        });
    });
});
module.exports = router;
