/**
 * Created by robot on 2017/2/21.
 */
$(function () {

    $.ajax({
        type: 'get',
        url: base_url + '/zion/channel_advisor/info',
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log(res.body)
            $('#email').html( res.body.email )
            $('#phone').html( res.body.phone )
        },
        error: function () {
        }
    })

})



window.onload = function () {

    $('.myAccount').find('a').addClass('active_bg');

    if (!is_admin) {
        $('.backstage').hide();
    } else {
        $('.backstage').show();
//            $('#password_hint').modal('show')
    }

    //关闭密码提示框
    $('.close_hint').click(function () {
        $('#password_hint').modal('hide')
    })

    //失去焦点验证
    $('#old_password').blur(function () {
        if ( $('#old_password').val()!='' ){
            $('#old_password').parent().removeClass('has-error')
            $('.old_password_caution').css("display", "none")
        }else {
            $('#old_password').parent().addClass('has-error')
            $('.old_password_caution').css("display", "block")
        }
    })
    $('#new_password').blur(function () {
        if ( $('#new_password').val()==$('#old_password').val() ){
            $('#new_password').parent().addClass('has-error')
            $('.new_password_caution').css("display", "block")

        }else {
            $('#new_password').parent().removeClass('has-error')
            $('.new_password_caution').css("display", "none")
        }
    })
    $('#new_password1').blur(function () {
        if ( $('#new_password1').val()==$('#new_password').val() ){
            $('#new_password1').parent().removeClass('has-error')
            $('.new_password1_caution').css("display", "none")
        }else {
            $('#new_password1').parent().addClass('has-error')
            $('.new_password1_caution').css("display", "block")
        }
    })

    $('.recompose').click(function () {
        if ($('#email').val() == ''){
            $('#email').parent().addClass('has-error')
            $('.email_caution').css("display", "block")
        }else {
            data.name = $('#email').val();
        }



        if ($('#new_password1').val()!=''&&$('#new_password').val()!=''&&$('#old_password').val()!=''&&$('#new_password').val()!=$('#old_password').val()&&$('#new_password1').val()==$('#new_password').val()){
            var data = {'old_password':$('#old_password').val(),'new_password':$('#new_password').val(),'confirm_password':$('#new_password1').val()}
            $.ajax({
                type: 'post',
                url: base_url + '/zion/channel_advisor/change_password',
                data: data,
//                    contentType: "application/json; charset=utf-8",
                headers: {
                    "mx_token": $.cookie('mx_token'),
                    "mx_secret": $.cookie('mx_secret')
                },
                success: function (res) {
                    if (res.msg == '您输入的旧密码有误'){
                        $('#old_password').parent().addClass('has-error')
                        $('.old_password_caution').css("display", "block")
                    }else if (res.msg == '两次输入的新密码不一致'){
                        $('#new_password1').parent().addClass('has-error')
                        $('.new_password1_caution').css("display", "block")
                    }
                    if (res.code==1){
                        $('#password_hint').modal('show')
                        $('#password_hint').modal({backdrop: 'static', keyboard: false});
                        // window.location.href = '/login.html';
                    }
                },
                error: function () {
                }
            })

        }

    })

    $('.close_hint').click(function () {
        window.location.href = '/login.html';
    })

}