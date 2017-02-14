$(function () {
    var phone = getUrlParam('phone');
    // input 获取焦点时删除错误警告
    $('.user_warp input').focus(function () {
        if ($(this).css('border-color') == 'red') {
            $(this).css('border-color', '#ccc')
        }
    });
    // 回车提交数据
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            $('.user_button button').click();
        }
    });
    // 点击提交密码修改信息
    $('.user_button button').click(function () {
        $(this).prop('disabled', true)
        if ($('.user_error').html('') != '') {
            $('.user_error').html('')
        }
        var password = $('#password').val();
        var new_password = $('#new_password').val();
        var confirm_password = $('#confirm_password').val();
        // 密码不能为空
        if (password == '') {
            $('#password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('原始密码不能为空');
            return false;
        }
        // 新密码不能为空
        if (new_password == '') {
            $('#new_password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('新密码不能为空');
            return false;
        }
        // 确认密码不能为空
        if (confirm_password == '') {
            $('#confirm_password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('确认新密码不能为空');
            return false;
        }
        // 新密码与确认密码不一致
        if (new_password != confirm_password) {
            // $('#new_password').css('border-color', 'red');
            $('#confirm_password').css('border-color', 'red');
            $('.user_error').html('新密码和确认新密码输入不一致');
            $('.user_button button').prop('disabled', false);
            return false;
        }

        // 所有校验通过，发送ajax请求
        postData({
            url: base_url + '/zion/channel_advisor/reset_password',
            data: {
                user_name: phone,
                password: password,
                new_password: new_password,
                confirm_password: confirm_password
            },
            sucFn: reset_success,
            failFn: failFn
        })
    });
    // 首次登录，修改密码失败，提示失败信息
    function failFn(res) {
        $('.user_button button').prop('disabled', false);
        $('.user_error').html(res.msg)
    }
    // 首次登录密码重置成功，自动触发登录
    function reset_success(res) {
        $('.user_button button').prop('disabled', false);
        var user_name = $('#user_name').val();
        var password = $('#password').val();
        postData({
            url: base_url + '/zion/channel_advisor/login',
            data: {phone: phone, password: $('#new_password').val()},
            sucFn: login_success/*,
            failFn: failFn*/
        })
    }
    // 登录成功，跳转至产品。存储cookie
    function login_success(res) {
        $.cookie('mx_token', res.body.mx_token);
        $.cookie('mx_secret', res.body.mx_secret);
        $.cookie('is_admin', res.body.is_admin);
        window.location = '/productList.html'
    }
});

