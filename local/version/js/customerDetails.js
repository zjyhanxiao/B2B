/**
 * Created by robot on 2017/2/21.
 */
$(function () {
    $('#product_head ul li[data-name="客户"]').addClass('active');

    $('.check_indent').attr('href','order.html?user='+getUrlParam('phone'))
    $.ajax({
        type: 'get',
        url: base_url + '/channel/customer/detail',
        data:{'phone':getUrlParam('phone')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log(res.body)
            $('#name').html( res.body.first_name+' '+res.body.last_name )
            $('#phone').html( res.body.phone )
            $('#email').html( res.body.email )
            $('#order_count').html( '<a href="order.html?user='+res.body.phone+'">'+res.body.order_count+'</a>' )
            $('#invest_amount').html( '$ '+res.body.invest_amount )

        },
        error: function () {
        }
    })


})

