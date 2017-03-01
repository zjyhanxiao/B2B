// var base_url = 'https://zion-api.meixinglobal.com';  // 线上接口地址
var base_url = 'https://zion-api.meixincn.com';   // 测试环境接口地址
// var base_url = 'http://192.168.1.102:8001'
var is_admin;    // 定义用户权限
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


// 验证登录和登出操作
$(function () {
// 获取cookie
    var mx_secret = $.cookie('mx_secret') || '',
        mx_token = $.cookie('mx_token') || '';
    // 验证登录（登录页，首次登录修改密码页，找回密码页，手机找回密码修改页）
    if (window.location.pathname !== '/login.html' &&
        window.location.pathname !== '/firstLogin_reset.html' &&
        window.location.pathname !== '/find_password.html' &&
        window.location.pathname !== '/find_password_by_phone.html' &&
        window.location.pathname !== '/find_password_step_one.html' &&
        window.location.pathname !== '/find_password_step_two.html' &&
        window.location.pathname !== '/auxiliary_order/invest_success.html' &&
        window.location.pathname !== '/auxiliary_order/shareAndSignature.html'
    ) {
        getData({
            url: base_url + '/zion/channel_advisor/authentication',
            data: {mx_secret: mx_secret, mx_token: mx_token},
            async: false,
            sucFn: is_login,
            failFn: no_login
        });
    }
    if (is_admin) {
        $('.backstage').css('visibility', 'inherit');
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
            data: {mx_secret: mx_secret, mx_token: mx_token},
            sucFn: logout_success
            // failFn: ''
        })
    });
    // 登出成功，清除本地cookie
    function logout_success() {
        $.cookie('mx_token', null);
        $.cookie('mx_secret', null);
        window.location = '/login.html'
    }

    function alertMsg(msg, ts, status) {
        var that = this;
        ts = ts || 2;
        var $tipw = $('#times-tip-wraps');
        if ($tipw && $tipw.length > 0) {
            $tipw.html('<span>' + msg + '</span>');
            $tipw.show();
        } else {
            var $tipw = $('<div id="times-tip-wraps" class="tips" ><span>' + msg + '</span></div>');
            $('body').append($tipw);
        }
        this.tipTs && clearTimeout(this.tipTs);
        this.tipTs = setTimeout(function () {
            $tipw.hide();
        }, ts * 1000);
        $tipw.unbind();
        $tipw.bind('click', function () {
            clearTimeout(that.tipTs);
            $(this).hide();
            return false;
        });
    }
});