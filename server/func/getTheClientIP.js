// "111.43.134.62"
// "::ffff:222.171.7.90"

// 处理获取到的格式差异

module.exports = function(clientIP){
    if(clientIP.indexOf(':') === -1){
        return clientIP;
    }else{
        return clientIP.slice(clientIP.lastIndexOf(':') + 1);
    }
}
