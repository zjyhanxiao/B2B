$(function () {
    /*$.cookie('mx_token',null);
     $.cookie('mx_secret',null);
     $.cookie('is_admin', null)*/
    $('.user_warp input').focus(function () {
        $(this).css('border-color', '#ccc')
    });
    $('.user_button button').on('click', function () {
        $(this).prop('disabled', true)
        if ($('.user_error').html('') != '') {
            $('.user_error').html('')
        }
        var user_name = $('#user_name').val();
        var password = $('#password').val();
        if (user_name == ''||!/(^1\d{10})$/.test(user_name)) {
            $('#user_name').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            $('.user_error').html('手机号码格式不正确');
            return false;
        }
        if (password == '') {
            $('#password').css('border-color', 'red');
            $('.user_button button').prop('disabled', false);
            return false;
        }
        postData({
            url: base_url + '/zion/channel_advisor/login',
            data: {phone: user_name, password: password},
            sucFn: login_success,
            failFn: login_fail,
            resetPas: resetPassword
        })
    });
    function login_success(res) {
        $.cookie('mx_token', res.body.mx_token);
        $.cookie('mx_secret', res.body.mx_secret);
        $.cookie('is_admin', res.body.is_admin);
        $('.user_button button').prop('disabled', false);
        window.location = '/productList.html'
    }

    function login_fail(res) {
        $('.user_button button').prop('disabled', false);
        $('.user_error').html(res.msg)
    }

    function resetPassword() {
        window.location = '/firstLogin_reset.html?phone=' + $('#user_name').val();

    }
});

