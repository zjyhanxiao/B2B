var base_url = 'http://192.168.1.102:8001';
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
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

$(function () {
    // 验证登录
    if (window.location.pathname !== '/login.html' &&
        window.location.pathname !== '/firstLogin_reset.html' &&
        window.location.pathname !== '/find_password.html' &&
        window.location.pathname !== '/find_password_by_phone.html'
    ) {
        getData({
            url: base_url + '/zion/channel_advisor/authentication',
            data: {mx_secret: $.cookie('mx_secret') || '', mx_token: $.cookie('mx_token') || ''},
            failFn: no_login
        });
    }
    function no_login() {
        window.location = '/login.html'
    }

    // 登出
    $('#logout').on('click', function () {
        getData({
            url: base_url + '/zion/channel_advisor/logout',
            data: {mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')},
            sucFn: logout_success
            // failFn: ''
        })
    });

    function logout_success() {
        $.cookie('mx_token', null);
        $.cookie('mx_secret', null);
        $.cookie('is_admin', null);
    }
});