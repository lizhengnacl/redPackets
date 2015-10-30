;;
(function($, GibberishAES) {
    var _m = document.getElementById('_m'),
        btn = document.getElementById('enveuse-btn'),
        sd = document.getElementById('sd'),
        telInput = document.getElementById('telInput'),
        telShow = document.getElementById('telShow');
    // 下拉刷新页面
    sd.addEventListener("touchend", function() {
        location.reload();
    }, false);

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

    // 加密
    function encrypt(tel) {
        return GibberishAES.enc(tel, "lizhengnacl");
    }

    // 解密
    function decrypt(aes) {
        return GibberishAES.dec(aes, "lizhengnacl");
    }

    // 解析href中的tel
    function getTheHrefTel() {
        var aes = location.hash.slice(1);
        // 可添加AES加密
        if (aes.length > 0) {
            return decrypt(aes);
        } else {
            return aes;
        }
    }

    // 将自己的号码添加到href中
    function addTheTelToHref(tel) {
        // 此处的tel将改为AES加密值
        location.href = location.href.slice(0, location.href.indexOf('#')) + '#' + encrypt(tel);
    }

    // 抢红包
    function grabRedPackets(text, hrefTel, cb) {
        $('#enveuse-btn').on('click', function() {
            $.ajax({
                type: 'POST',
                url: 'http://121.42.56.249:3000/grab',
                data: {
                    tel: text,
                    hrefTel: hrefTel
                },
                dataType: 'json',
                success: function(data, status, xhr) {
                    cb(data);
                },
                error: function() {}
            });
        });
    }

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
                        addTheTelToHref(data.tel);
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
    localStorage.removeItem('_t');
    localStorage.removeItem('_m');
    // }
})($, GibberishAES);
