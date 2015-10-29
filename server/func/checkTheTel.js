var request = require('request');

module.exports = function(tel, cb) {
    //
    var href = 'http://api.k780.com:88/?app=phone.get&appkey=16017&sign=d73763079fd3bb600085e449dc16966d&format=json&phone=' + tel;
    request(href, function(error, res, body) {
        if (!error && res.statusCode == 200) {
            var obj = JSON.parse(body);
            cb(obj);
        }
    })
}
