var request = require('request');

module.exports = function(tel, cb) {
    var arr = ['http://chongzhi.jd.com/json/order/search_searchPhone.action?mobile=', 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel='];
    // typeof tel === string  true
    var str = arr[(tel.charAt(8) % 2)];
    var href = str + tel;
    request(href, function(error, res, body) {
        if (!error && res.statusCode == 200) {
            var str = (body.charAt(0) === '_') ? 'catName' : 'providerName';
            if (body.indexOf(str) !== -1) {
                cb({
                    success: 1
                });
            } else {
                cb({
                    success: 0
                });
            }
        }else{
            cb({
                success: 0
            });
        }
    })
}
