;;
(function($) {
    var _m = document.getElementById('_m'),
        btn = document.getElementById('enveuse-btn'),
        sd = document.getElementById('sd'),
        telInput = document.getElementById('telInput'),
        telShow = document.getElementById('telShow');
    // 下拉刷新页面
    sd.addEventListener("touchend", function() {
        location.reload();
    }, false);
    // 用localStorage判断是否已经领取过
    // localStorage._m localStorage._t
    // 同时使用localStorage和服务器端验证，不过localStorage优先级更好，这样虽不能做到百分之百，但已经能覆盖绝大数情况

    // 判断localStorage是否存在
    function chargeLocalStorage(value) {
        if (value === undefined || value === 'undefined') {
            return false;
        }
        return true;
    }

    // 判断号码是否存在
    function checkTheTel(tel, cb) {
        $.ajax({
            type: 'POST',
            url: 'http://121.42.56.249:3000/tel',
            data: {
                tel: tel
            },
            dataType: 'json',
            success: function(data, status, xhr) {
                cb(data);
            },
            error: function() {}
        });
    }

    // tel能使用按钮
    function canUseButton() {
        $('#enveuse-btn').attr('disabled', null);
        $('#telInput').addClass('telCanUse');
        $('#telInfo').html('号码正确');
    }

    // 不能使用按钮
    function canNotUseButton() {
        $('#enveuse-btn').attr('disabled', 'disabled');
        $('#telInput').removeClass('telCanUse');
        $('#telInfo').html('号码错误');
    }

    // 解析href中的tel
    function getTheHrefTel(){
        var tel = location.hash.slice(1);
        // 可添加AES加密
        return tel;
    }

    // 将自己的号码添加到href中
    function addTheTelToHref(tel){
        // 此处的tel将改为AES加密值
        location.href = location.href.slice(0, location.href.indexOf('#')) + '#' + tel;
    }

    // 抢红包
    function grabRedPackets(text, hrefTel, cb) {
        $('#enveuse-btn').on('click', function() {
            $.ajax({
                type: 'POST',
                url: 'http://121.42.56.249:3000/grab',
                data: {
                    tel : text,
                    hrefTel : hrefTel
                },
                dataType: 'json',
                success: function(data, status, xhr) {
                    cb(data);
                },
                error: function() {}
            });
        });
    }
    if (chargeLocalStorage(localStorage._m) && chargeLocalStorage(localStorage._t)) {
        $('#_m').html(localStorage._m);
        $('#newUser').hide();
        $('#telShow').html(localStorage._t);
        $('#enveuse-btn').attr('value', '^_^');
        $('#enveuse-btn').addClass('grabbed');
    } else {
        var $oldUser = $('#oldUser'),
            $newUser = $('#newUser'),
            $telShow = $('#telShow'),
            $_m = $('#_m'),
            $enveuseBtn = $('#enveuse-btn');
        $telInput = $('#telInput');
        $oldUser.hide();
        $telInput.on('keyup', function() {
            var text = $telInput.attr('value');
            if (text.length < 11) {
                canNotUseButton();
                $('#telInfo').html('请输入手机号码');
                return;
            } else if (text.length === 11) {
                // 发送请求判断号码正确性
                checkTheTel(text, function(data) {
                    // 号码正确后使按钮可用
                    // 将字符串转换为数字
                    if (+data.success === 1) {
                        canUseButton();
                        // 点击按钮，抢红包
                        // grab接口传递的数据
                        var hrefTel = getTheHrefTel();
                        grabRedPackets(text, hrefTel, function(data) {
                            // 改变页面样式
                            $telShow.html(data.tel);
                            $_m.html(data.money);
                            $oldUser.show();
                            $newUser.hide();
                            $enveuseBtn.attr('value', '^_^');
                            $enveuseBtn.addClass('grabbed');
                            // 然后进行持久化操作
                            localStorage._m = data.money;
                            localStorage._t = data.tel;
                        });
                    } else {
                        canNotUseButton();
                    }
                });
            } else {
                canNotUseButton();
                $telInput[0].value = text.slice(0, 11);
                $telInput.keyup();
            }
        });
    }
})($);
