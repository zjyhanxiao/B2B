$(function () {
    var phone = getUrlParam('phone');
    $('.user_warp input').focus(function () {
        $(this).css('border-color', '#ccc')
    });
    $('.user_button button').click(function () {
        $(this).prop('disabled', true)
        if ($('.user_error').html('') != '') {
            $('.user_error').html('')
        }
        var password = $('#password').val();
        var new_password = $('#new_password').val();
        var confirm_password = $('#confirm_password').val();
        if (password == '') {
            $('#password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('原始密码不能为空');
            return false;
        }
        if (new_password == '') {
            $('#new_password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('新密码不能为空');
            return false;
        }
        if (confirm_password == '') {
            $('#confirm_password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('确认新密码不能为空');
            return false;
        }
        if (new_password != confirm_password) {
            $('#new_password').css('border-color', 'red');
            $('#confirm_password').css('border-color', 'red');
            $('.user_error').html('新密码和确认新密码输入不一致');
            $('.user_button button').prop('disabled', false);
            return false;
        }
        postData({
            url: base_url + '/zion/channel_advisor/reset_password',
            data: {
                user_name: phone,
                password: password,
                new_password: new_password,
                confirm_password: confirm_password
            },
            sucFn: reset_success,
            failFn: login_fail
        })
    });
    function reset_success(res) {
        $('.user_button button').prop('disabled', false);
        var user_name = $('#user_name').val();
        var password = $('#password').val();
        postData({
            url: base_url + '/zion/channel_advisor/login',
            data: {phone: phone, password: $('#new_password').val()},
            sucFn: login_success,
            failFn: login_fail
        })
    }

    function login_success(res) {
        $.cookie('mx_token', res.body.mx_token);
        $.cookie('mx_secret', res.body.mx_secret);
        $.cookie('is_admin', res.body.is_admin);
        window.location = '/productList.html'
    }

    function login_fail(res) {
        $('.user_button button').prop('disabled', false);
        $('.user_error').html(res.msg)
    }
})

