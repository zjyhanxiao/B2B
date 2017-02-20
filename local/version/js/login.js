$(function () {
    // 进登录页面，先清除本地cookie
    $.cookie('mx_token', null);
    $.cookie('mx_secret', null);
    // input 获取焦点时删除错误警告
    $('.user_warp input').focus(function () {
        $(this).css('border-color', '#ccc')
    });
    // 回车提交数据
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            $('.user_button button').click();
        }
    });
    // 点击提交登录信息
    $('.user_button button').on('click enter', function () {
        $(this).prop('disabled', true);
        if ($('.user_error').html('') != '') {
            $('.user_error').html('')
        }
        var user_name = $('#user_name').val();
        var password = $('#password').val();
        // 手机号不能为空
        if (user_name == '') {
            $('#user_name').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('手机号码不能为空');
            return false;
        }
        // 手机号格式校验以1开头，后跟10位数字
        if (user_name != '' && !/(^1\d{10})$/.test(user_name)) {
            $('#user_name').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('手机号码格式不正确');
            return false;
        }
        // 密码不能为空
        if (password == '') {
            $('#password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            return false;
        }
        // 所有校验通过，发送ajax请求
        postData({
            url: base_url + '/zion/channel_advisor/login',
            data: {phone: user_name, password: password},
            sucFn: login_success,
            failFn: login_fail,
            resetPas: resetPassword
        })
    });
    // 登录成功 设置cookie，跳转页面
    function login_success(res) {
        $.cookie('mx_token', res.body.mx_token);
        $.cookie('mx_secret', res.body.mx_secret);
        $('.user_button button').prop('disabled', false);
        window.location = '/productList.html'
    }

    // 登录失败，提示失败信息
    function login_fail(res) {
        $('.user_button button').prop('disabled', false);
        $('.user_error').html(res.msg)
    }

    // 首次登录，跳转至首次登录重置密码页面
    function resetPassword() {
        window.location = '/firstLogin_reset.html?phone=' + $('#user_name').val();

    }
});

