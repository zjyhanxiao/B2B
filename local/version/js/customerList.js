/**
 * Created by robot on 2017/2/21.
 */
$(function () {
    $('#product_head ul li[data-name="客户"]').addClass('active');

    $.ajax({
        type: 'get',
        url: base_url + '/channel/customer/list',
        data:{'condition':''},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log(res.body)

            if (res.body.length<1){
                $('.chart_body').html('<div style="width: 1170px;margin: 0 auto"><img style="width: 69px;height: 69px;display: block;margin: 20px auto" src="../vendor/img/wu.png" alt=""><p class="text-center" style="margin: 0 auto;width: 100%;"> 暂无数据！ </p></div>')
                $('.chart_head').css('border-bottom','1px solid #cccccc')
            }else {
                $('.chart_head').css('border-bottom','none')
                var userhtml = ''
                $.each(res.body,function (i,item) {
                    userhtml += '<tr> <td class="w_160"><a class="" href="customerDetails.html?phone='+item.phone+'">'+item.first_name+' '+item.last_name+'</a></td>' +
                        ' <td class="w_175">'+item.phone+'</td>' +
                        ' <td class="w_285">'+item.email+'</td>' +
                        ' <td class="w_190">'+item.last_invest_time+'</td> ' +
                        '<td class="w_160">'+item.order_count+'</td>' +
                        ' <td class="w_200">'+item.invest_amount+'</td> </tr>'
                })
                $('.chart_body').html(userhtml)

            }
        },
        error: function () {
        }
    })

})


$('.glyphicon-search').click(function () {


        $.ajax({
            type: 'get',
            url: base_url + '/channel/customer/list',
            data:{'condition':$('.search_input').val()},
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log(res.body)

                if (window["context"] == undefined) {
                    if (!window.location.origin) {
                        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                    }
                    window["context"] = location.origin;
                }


                if (res.body.length<1){
                    $('.chart_body').html('<div style="width: 1170px;margin: 0 auto"><img style="width: 69px;height: 69px;display: block;margin: 20px auto" src="../vendor/img/wu.png" alt=""><p class="text-center" style="margin: 0 auto;width: 100%;"> 暂无数据！ </p></div>')
                    $('.chart_head').css('border-bottom','1px solid #cccccc')
                }else {
                    $('.chart_head').css('border-bottom','none')
                    var userhtml = ''
                    $.each(res.body,function (i,item) {
                        userhtml += '<tr> <td class="w_160"><a class="" href="customerDetails.html?phone='+item.phone+'">'+item.first_name+' '+item.last_name+'</a></td>' +
                            ' <td class="w_175">'+item.phone+'</td>' +
                            ' <td class="w_285">'+item.email+'</td>' +
                            ' <td class="w_190">'+item.last_invest_time+'</td> ' +
                            '<td class="w_160">'+item.order_count+'</td>' +
                            ' <td class="w_200">'+item.invest_amount+'</td> </tr>'
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
    $('.add_counselor').modal('show')
})