/**
 * Created by robot on 2017/2/21.
 */
$('#product_head ul li[data-name="内部管理"]').addClass('active');

$(function () {

    $.ajax({
        type: 'get',
        url: base_url + '/zion/channel/searchChannelList',
        data:{'query':''},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log( res.body )
            if (res.body.length<1){
                $('.chart_body').html('无数据')
                $('.chart_head').css('border-bottom','1px solid #cccccc')
            }else {
                $('.chart_head').css('border-bottom','none')
                var userhtml = ''
                $.each(res.body,function (i,item) {

                    //null转化为0
                    if (item.amount==null){
                        item.amount=0;
                    }
                    userhtml += '<tr> <td class="w_175"><a href="backstageDetails.html?id='+item.id+'&code='+item.code+'">'+item.code+'</a></td> ' +
                        '<td class="w_160">'+item.name+'</td> ' +
                        '<td class="w_190">'+item.phone+'</td> ' +
                        '<td class="w_285">'+item.email+'</td> ' +
                        '<td class="w_160">'+item.count+'</td> ' +
                        '<td class="w_200">'+item.amount+'</td> </tr>'
                })
                $('.chart_body').html(userhtml)
            }
        },
        error:function () {
        }
    })

})
//搜索子渠道功能
$('.glyphicon-search').click(function () {

        $.ajax({
            type: 'get',
            url: base_url + '/zion/channel/searchChannelList',
            data:{'query':$('.search_input').val()},
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log( res.body )
                if (res.body.length<1){
                    $('.chart_body').html('无数据')
                    $('.chart_head').css('border-bottom','1px solid #cccccc')
                }else {
                    $('.chart_head').css('border-bottom','none')
                    var userhtml = ''
                    $.each(res.body,function (i,item) {
                        //null转化为0
                        if (item.amount==null){
                            item.amount=0;
                        }
                        userhtml += '<tr> <td class="w_175"><a href="backstageDetails.html?id='+item.id+'&code='+item.code+'">'+item.code+'</a></td>' +
                            ' <td class="w_160">'+item.name+'</td>' +
                            ' <td class="w_190">'+item.phone+'</td>' +
                            ' <td class="w_285">'+item.code+'</td>' +
                            ' <td class="w_160">'+item.count+'</td> ' +
                            '<td class="w_200">'+item.code+'</td> </tr>'
                    })
                    $('.chart_body').html(userhtml)
                }
            },
            error: function () {
            }
        })
})


//添加顾问模态框
$('.add_btn').click(function () {
    $.ajax({
        type: 'get',
        url: base_url + '/zion/channel/getChannelCode',
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log( res.body )
            $('#code').html(res.body)
            $('#password').val(res.body)

            $('.add_counselor').modal('show')
        },
        error: function () {

        }
    })
})

//顾问模态框验证



$('#name').blur(function () {
    if ( $('#name').val()!='' ){
        $('#name').parent().removeClass('has-error')
        $('.name_caution').css("display", "none")
    }else {
        $('#name').parent().addClass('has-error')
        $('.name_caution').css("display", "block")
    }
})
$('#phone').blur(function () {
    if ( $('#phone').val().length >10 ){
        $('#phone').parent().removeClass('has-error')
        $('.phone_caution').css("display", "none")
    }else {
        $('#phone').parent().addClass('has-error')
        $('.phone_caution').css("display", "block")
    }
})
$('#email').blur(function () {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
    if ( reg.test($('#email').val()) ){
        $('#email').parent().removeClass('has-error')
        $('.email_caution').css("display", "none")
    }else {
        $('#email').parent().addClass('has-error')
        $('.email_caution').css("display", "block")
    }
})

//顾问模态框创建按钮
$('.invest_create').click(function () {
    var data = {}
    data.id = '';

    if ($('#name').val() == ''){
        $('#name').parent().addClass('has-error')
        $('.name_caution').css("display", "block")
    }else {
        data.name = $('#name').val();
    }
    if ($('#phone').val() == ''){
        $('#phone').parent().addClass('has-error')
        $('.phone_caution').css("display", "block")
    }else {
        data.phone = $('#phone').val();
    }
    if ($('#email').val() == ''){
        $('#email').parent().addClass('has-error')
        $('.email_caution').css("display", "block")
    }else {
        data.email = $('#email').val();
    }
    if ($('#password').val() != ''){
        data.code = $('#password').val();
    }else {
        alert('首次登录密码不能为空！')
    }


    if ($('#name').val() != ''&& $('#phone').val() != '' && $('#email').val() != '' && $('#password').val() != ''){

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
                $('.add_counselor').modal('hide')
                window.location.reload()
            },
            error: function () {
                alert('创建失败')
            }
        })


    }

})

//顾问模态框取消按钮
$('.invest_abolish').click(function () {
    $('#name').val('')
    $('.name_caution').css('display','none')
    $('#phone').val('')
    $('.phone_caution').css('display','none')
    $('#email').val('')
    $('.email_caution').css('display','none')

    $('.add_counselor').modal('hide')
})
