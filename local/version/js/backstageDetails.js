/**
 * Created by robot on 2017/2/21.
 */
$('#product_head ul li[data-name="内部管理"]').addClass('active');

$(function () {

    var inputdata = {}
    $.ajax({
        type: 'get',
        url: base_url + '/zion/channel/amount',
        data: {'code':getUrlParam('code')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log( res.body )
            inputdata = res.body;

            if (res.body.amount == null){
                res.body.amount = 0;
            }
            $('.look_indent').attr('href',encodeURI('/order.html?channel='+ res.body.code))

            $('#counselor').html('投资顾问  '+res.body.name+'   ('+res.body.code+')')
            $('#phone').html(res.body.phone)
            $('#email').html(res.body.email)
            $('#number').html(res.body.count)
            $('#price').html(res.body.amount)
            $('.counselor-name').html(res.body.name+'   ('+res.body.code+')')
            $('#code').html(res.body.code)

            $('#alter_phone').val(res.body.phone)
            $('#alter_email').val(res.body.email)
            $('#name').val(res.body.name)
            $('.change_info').modal('hide')


            $('.name_title').html(res.body.name+'   ('+res.body.code+')')

            if (res.body.is_admin){
                $('.no_admin').css('display','none')
            }else {
                $('.no_admin').css('display','block')
            }

            if (res.body.is_active){
                $('.show_permission').html('')
                $('.login_on').html('关闭登录权限')
                $('.login_on').css('color','red')
            }else {
                $('.show_permission').html('登录权限已暂停')
                $('.login_on').html('开启登录权限')
                $('.login_on').css('color','#337ab7')
            }
        },
        error: function () {
        }
    })
    //修改模态框
    $('.change').click(function () {
        $('#alter_phone').val(inputdata.phone)
        $('#alter_email').val(inputdata.email)
        $('#name').val(inputdata.name)

        $('.change_info').modal('show')

    })


})



// //修改模态框
// $('.change').click(function () {
//     $('.change_info').modal('show')
// })
//修改模态框blur验证
$('#name').blur(function () {
    if ( $('#name').val()!='' ){
        $('#name').parent().removeClass('has-error')
        $('.name_caution').css("display", "none")
    }else {
        $('#name').parent().addClass('has-error')
        $('.name_caution').css("display", "block")
    }
})
$('#alter_phone').blur(function () {
    if ( $('#alter_phone').val().length > 10 ){
        $('#alter_phone').parent().removeClass('has-error')
        $('.phone_caution').css("display", "none")
    }else {
        $('#alter_phone').parent().addClass('has-error')
        $('.phone_caution').css("display", "block")
    }
})
$('#alter_email').blur(function () {
    var reg = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/
    if ( reg.test($('#alter_email').val()) ){
        $('#alter_email').parent().removeClass('has-error')
        $('.email_caution').css("display", "none")
    }else {
        $('#alter_email').parent().addClass('has-error')
        $('.email_caution').css("display", "block")
    }
})


//修改信息模态框确定按钮
$('#confirm_info').click(function () {
    var data = {};
    data.id = getUrlParam('id');
    data.code = getUrlParam('code');

    if ($('#name').val() == ''){
        $('#name').parent().addClass('has-error')
        $('.name_caution').css("display", "block")
    }else {
        data.name = $('#name').val();
    }
    if ($('#alter_phone').val() == ''){
        $('#alter_phone').parent().addClass('has-error')
        $('.phone_caution').css("display", "block")
    }else {
        data.phone = $('#alter_phone').val();
    }
    if ($('#alter_email').val() == ''){
        $('#alter_email').parent().addClass('has-error')
        $('.email_caution').css("display", "block")
    }else {
        data.email = $('#alter_email').val();
    }

    if ($('#name').val() != ''&& $('#alter_phone').val() != '' && $('#alter_email').val() != ''){

        console.log('1')

        $.ajax({
            type: 'post',
            url: base_url + '/zion/channel/editChannel',
            data: JSON.stringify( data ),
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log( res.body )
                $('.change_info').modal('hide')
                window.location.reload()
            },
            error: function () {
                alert('修改失败')
            }
        })
    }


})
//修改模态框取消按钮
$('#abolish_info').click(function () {
    $('.phone_caution').css('display','none')
    $('#alter_phone').parent().removeClass('has-error')
    $('.email_caution').css('display','none')
    $('#alter_email').parent().removeClass('has-error')
    $('.name_caution').css('display','none')
    $('#alter_name').parent().removeClass('has-error')

    console.log('1')

    $('.change_info').modal('hide')
})
$('.close_on').click(function () {
    $('.phone_caution').css('display','none')
    $('#alter_phone').parent().removeClass('has-error')
    $('.email_caution').css('display','none')
    $('#alter_email').parent().removeClass('has-error')
    $('.name_caution').css('display','none')
    $('#alter_name').parent().removeClass('has-error')
})






//重置密码模态框
$('.reset').click(function () {
    $('.reset_password').modal('show')
})
//密码确定按钮
$('#confirm_password').click(function () {

    if ($('#password').val()!=''){

        var data = {'code':getUrlParam('code'),'password':$('#password').val()}
        console.log(data)
        $.ajax({
            type: 'post',
            url: base_url + '/zion/channel_advisor/reset_password',
            data: data  ,
//                contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log( res.body )
                $('.reset_password').modal('hide')
            },
            error: function () {
            }
        })

    }else {
        alert('请输入重置的密码！')
    }

})
//密码取消按钮
$('#abolish_password').click(function () {
    $('#password').val('')
    $('.reset_password').modal('hide')
})

//登录权限
$('.login_on').click(function () {

    if ($('.login_on').html() == '关闭登录权限'){
        $('.message').html('关闭登录权限后，该用户将无法登陆查看用户信息或跟进订单情况。')
        $('#confirm_permission').css({'background':'#ff9933','border-color':'#ff9933'})

        $('.permission').modal('show')
    }else {
        $('.message').html('开启登录权限后，该用户将可以登陆查看用户信息或跟进订单情况。')
        $('#confirm_permission').css({'background':'#337ab7','border-color':'#337ab7'})

        $('.permission').modal('show')
    }

})

//登录权限模态框确定
$('#confirm_permission').click(function () {

    if ($('.login_on').html() == '关闭登录权限'){
        var data = {'code':getUrlParam('code'),'is_active':false}
        $.ajax({
            type: 'get',
            url: base_url + '/zion/channel/reviseLoginAuthority',
            data: data  ,
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log( '1' )
                $('.show_permission').html('登录权限已暂停')
                $('.login_on').html('开启登录权限')
                $('.login_on').css('color','#337ab7')
                $('.permission').modal('hide')
            },
            error: function () {
            }
        })
    }else {
        var data = {'code':getUrlParam('code'),'is_active':true}
        $.ajax({
            type: 'get',
            url: base_url + '/zion/channel/reviseLoginAuthority',
            data: data  ,
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log( '2' )
                $('.show_permission').html('')
                $('.login_on').html('关闭登录权限')
                $('.login_on').css('color','red')
                $('.permission').modal('hide')
            },
            error: function () {
            }
        })
    }

})


$('#abolish_permission').click(function () {
    $('.permission').modal('hide')
})