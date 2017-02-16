 var base_url = 'https://zion-api.meixincn.com';
// var base_url = '192.168.1.106:8001;'
// 定义用户权限
var is_admin;
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
// 获取cookie
var mx_secret = $.cookie('mx_secret') || '',
    mx_token = $.cookie('mx_token') || '';
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


// 验证登录和登出操作
$(function () {
    // 验证登录（登录页，首次登录修改密码页，找回密码页，手机找回密码修改页）
    if (window.location.pathname !== '/login.html' &&
        window.location.pathname !== '/firstLogin_reset.html' &&
        window.location.pathname !== '/find_password.html' &&
        window.location.pathname !== '/find_password_by_phone.html'
    ) {
        getData({
            url: base_url + '/zion/channel_advisor/authentication',
            data: {mx_secret: $.cookie('mx_secret') || '', mx_token: $.cookie('mx_token') || ''},
            async: false,
            sucFn: is_login,
            failFn: no_login
        });
    }
    if (!is_admin) {
        $('#product_head .backstage').remove();
    }
    function is_login(res) {
        is_admin = res.body;
    }

    // 未登录状态跳转至登录页
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
    // 登出成功，清除本地cookie
    function logout_success() {
        $.cookie('mx_token', null);
        $.cookie('mx_secret', null);
    }
});