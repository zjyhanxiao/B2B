// var base_url = 'https://zion-api.meixinglobal.com';  // 线上接口地址
// var base_url = 'https://zion-api.meixincn.com';   // 测试环境接口地址
// var base_url = 'http://192.168.1.102:8001'
var is_admin;    // 定义用户权限
// 验证登录和登出操作
$(function () {
// 获取cookie
    var mx_secret = $.cookie('mx_secret') || '',
        mx_token = $.cookie('mx_token') || '';
    getData({
        url: base_url + '/zion/channel_advisor/authentication',
        data: {mx_secret: mx_secret, mx_token: mx_token},
        async: false,
        sucFn: is_login,
        failFn: no_login
    });
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
        window.location = '/index.html'
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