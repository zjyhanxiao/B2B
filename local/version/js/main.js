var base_url = 'https://zion-api.meixinglobal.com';  // 线上接口地址
// var base_url = 'https://zion-api.meixincn.com';   // 测试环境接口地址
// var base_url = 'http://192.168.1.102:8001'
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var s = window.location.search;
    if (/[\u4e00-\u9fa5]/.test(s)) {
        s = decodeURI(s);
    }
    var r = s.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
//公用post请求
var postData = function (opt) {
    $.ajax({
        type: 'post',
        url: opt.url,
        data: opt.data,
        headers: opt.headers,
        timeout: 15e3,
        async: false,
        contentType: opt.contentType,
        // "contentType":"application/json; charset=utf-8",
        success: function (res) {
            if (res.code == 1) {
                opt.sucFn && opt.sucFn(res)
            }
            if (res.code == 0) {
                opt.failFn && opt.failFn(res)
            }
            if (res.code == 2) {
                opt.resetPas && opt.resetPas(res)
            }
            if (res.code == -1 && res.msg == 'auth failed') {
                window.location = '/login.html'
            }
        }
    })
};
//公用get请求
var getData = function (opt) {
    $.ajax({
        type: 'get',
        url: opt.url,
        data: opt.data,
        headers: opt.headers,
        timeout: 15e3,
        async: opt.async,
        contentType: opt.contentType,
        // "contentType":"application/json; charset=utf-8",
        success: function (res) {
            if (res.code == 1) {
                opt.sucFn && opt.sucFn(res)
            }
            if (res.code == 0) {
                opt.failFn && opt.failFn(res)
            }
            if (res.code == 2) {
                opt.resetPas && opt.resetPas(res);
            }
            if (res.code == -1 && res.msg == 'auth failed') {
                window.location = '/login.html'
            }
        }
    })
};