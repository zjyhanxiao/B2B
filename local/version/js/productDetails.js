/**
 * Created by robot on 2017/2/21.
 */

//    var base_url = 'http://192.168.1.102:8001';
//    var base_url = 'https://zion-api.meixincn.com';
$(function () {


    //产品描述接口
    $.ajax({
        type: 'get',
        url: base_url + '/channel/product/description',
        data: {'product_id':getUrlParam('product_id')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log(res.body)
            $('.product_html').html(res.body)
        },
        error: function () {
        }
    })


    //产品信息接口    //系列产品接口
    $.ajax({
        type: 'get',
        url: base_url + '/channel/product/info',
        data: {'product_id':getUrlParam('product_id')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            //头部信息
            var product_name = res.body.name;
            $('.vieworder').attr('href','/order.html?product='+res.body.number)
            $('#name_number').html(res.body.name+' '+res.body.number)
            if (res.body.status == 'FOR_APPOINTMENT'){
                $('#state').html('预售').addClass('bg_yu')

                $('.notsell').html('<p> 此产品还没有发售 </p>')
            }
            if (res.body.status == 'FOR_INVEST'){
                $('#state').html('在售').addClass('bg_zai')
            }
            if (res.body.status == 'SOLD_OUT'||res.body.status == 'OFFLINE'){
                $('#state').html('售罄').addClass('bg_qing')

                $('.notsell').html('<p> 此产品已经售罄 </p>')
            }


            //表格信息
            $('#returnRate').html(res.body.return_rate+'%')
            $('#investTerm').html(res.body.invest_term+'个月')
            $('#minimumInvestAmount').html('$'+res.body.minimum_invest_amount)
            $('#SaleDay').html('<p>'+res.body.start_sale_day+'  至  '+res.body.end_sale_day+'</p>')
            $('#closeFundStartInterestDay').html('<p>'+res.body.close_fund_start_interest_day+'</p>')

            //系列产品
            $('#name').html(res.body.name);

            //系列产品接口
            $.ajax({
                type: 'get',
                url: base_url + '/channel/product/list_by_name',
                data: {'product_name': product_name},
                contentType: "application/json; charset=utf-8",
                headers: {
                    "mx_token": $.cookie('mx_token'),
                    "mx_secret": $.cookie('mx_secret')
                },
                success: function (res) {
//                        console.log(res.body)
                    var tabhtml = '';
                    $.each(res.body,function (j,jtem) {

                        var statu = '';
                        if (jtem.status == 'OFFLINE'){
                            statu = '<a href="productDetails.html?product_id='+jtem.id+'" class="state bg_qing">售罄</a>'
                        }
                        if (jtem.status == 'SOLD_OUT'){
                            statu = '<a href="productDetails.html?product_id='+jtem.id+'" class="state bg_qing">售罄</a>'
                        }
                        if (jtem.status == 'FOR_INVEST'){
                            statu = '<a href="productDetails.html?product_id='+jtem.id+'" class="state bg_zai">在售</a>'
                        }
                        if (jtem.status == 'FOR_APPOINTMENT'){
                            statu = '<a href="productDetails.html?product_id='+jtem.id+'" class="state bg_yu">预售</a>'
                        }
                        tabhtml +='<tr><td><a href="productDetails.html?product_id='+jtem.id+'" class="color_223976">'+jtem.number+'</a></td>' +
                            '<td>'+jtem.return_rate+'%</td>' +
                            '<td>'+jtem.invest_term+'个月</td>' +
                            '<td>'+jtem.close_fund_start_interest_day+'</td>' +
                            '<td>'+jtem.start_sale_day+'</td>' +
                            '<td>'+jtem.end_sale_day+'</td>' +
                            '<td class="">'+statu+'</td></tr>'
                    })
                    $('#series').html(tabhtml)

                },
                error: function () {
                }
            })

        },
        error: function () {
        }
    })

    //文件文档接口
    $.ajax({
        type: 'get',
        url: base_url + '/channel/product/document',
        data: {'product_id':getUrlParam('product_id')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log(res.body)
            //法律文件
            var legalhtml = '';
            $.each(res.body.legal_document,function ( i , item ) {
                legalhtml += '<p><a target="_blank" style="color: #159bd6" href="'+item.document_url+'">'+item.document_name+'</a></p>'
            })
            $('#legal_document').html(legalhtml )
            //销售文件
            var saleshtml = '';
            $.each(res.body.sales_document,function ( i , item ) {
                saleshtml += '<p><a target="_blank"  style="color: #159bd6" href="'+item.document_url+'">'+item.document_name+'</a></p>'
            })
            $('#sales_document').html(saleshtml )
            //产品介绍文件
//                var introducehtml = '';
//                $.each(res.body.introduce_document,function ( i , item ) {
//                    introducehtml += '<p><a target="_blank" href="'+item.document_url+'">'+item.document_name+'</a></p>'
//                })
//                $('#introduce_document').html(introducehtml )

            //视频文件
            if (res.body.sales_video.length<1){
                $('.none').css('display','none')
            }else {
                $('.videos').html( res.body.sales_video[0].document_url )
            }

        },
        error: function () {
        }
    })

    //入金接口
    $.ajax({
        type: 'get',
        url: base_url + '/channel/product/payment',
        data: {'product_id':getUrlParam('product_id')},
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
                console.log(res.body)
            var p = $('<p></p>')
            if (res.body.is_ach_enabled){
                p.append('ACH（仅支持美国银行账户） ；')
            }
            if (res.body.is_receive_bank_enabled){
                p.append('银行电汇/Wire 【<span class="payway">入金指南</span>】 ')
                $('#account_name').html(res.body.receive_bank.account_name)
                $('#account_address').html(res.body.receive_bank.account_address)
                $('#bank_name').html(res.body.receive_bank.bank_name)
                $('#bank_address').html(res.body.receive_bank.bank_address)
                $('#routing_number').html(res.body.receive_bank.routing_number)
                $('#swift_code').html(res.body.receive_bank.swift_code)
                $('#account_number').html(res.body.receive_bank.account_number)
                $('#remark').html(res.body.receive_bank.remark)
            }

            if (res.body.is_middle_bank_enabled){
                $('.middle_bank').css('display','block');
                $('#middle_bank_name').html(res.body.middle_bank.bank_name)
                $('#middle_bank_address').html(res.body.middle_bank.bank_address)
                $('#middle_swift_code').html(res.body.middle_bank.swift_code)
            }else {
                $('.middle_bank').css('display','none');
            }
            $('#payment_way').html( p)


        },
        error: function () {
        }
    })

    //投资顾问分享接口    // 二维码生成

    if (is_admin){

        $.ajax({
            type: 'get',
            url: base_url + '/zion/channel_advisor/list',
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
//                    console.log(res.body)
                var selecthtml1 = '';
                $.each(res.body,function (i,item) {
                    selecthtml1 += '<option value="'+item.code+'">'+item.code+' - '+item.name+'</option>'
                })
                $('#select1').html(selecthtml1)
                $('#select2').html(selecthtml1)


                // 兼容ie
                if (window["context"] == undefined) {
                    if (!window.location.origin) {
                        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                    }
                    window["context"] = location.origin;
                }

                $('.sharelink').attr("value",window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+res.body[0].code)
                $('.order_btn').data('shuju',window.location.origin+"/auxiliary_order/stepOne.html?product_id="+getUrlParam('product_id')+"&channel_code="+res.body[0].code)

                $('.order_btn').data('code',res.body[0].code)

                $.ajax({
                    type: 'get',
                    url: base_url + '/channel/qrcode/create',
                    data: {"content":window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+res.body[0].code},
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        "mx_token": $.cookie('mx_token'),
                        "mx_secret": $.cookie('mx_secret')
                    },
                    success: function (res) {
                        console.log(res.body)
                        $('#QRcode').attr( 'src',res.body )
                    },
                    error: function () {
                    }
                })
            },
            error: function () {
            }
        })
    }else {

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

                // 兼容ie
                if (window["context"] == undefined) {
                    if (!window.location.origin) {
                        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                    }
                    window["context"] = location.origin;
                }

                $('.sharelink').attr("value",window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+res.body.code)
                $('.order_btn').data('shuju',window.location.origin+"/auxiliary_order/stepOne.html?product_id="+getUrlParam('product_id')+"&channel_code="+res.body.code)

                $('.order_btn').data('code',res.body.code)

                $.ajax({
                    type: 'get',
                    url: base_url + '/channel/qrcode/create',
                    data: {"content":window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+res.body.code},
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        "mx_token": $.cookie('mx_token'),
                        "mx_secret": $.cookie('mx_secret')
                    },
                    success: function (res) {
                        console.log(res.body)
                        $('#QRcode').attr( 'src',res.body )
                    },
                    error: function () {
                    }
                })


            },
            error: function () {
            }
        })
    }


})


window.onload = function () {

    $('#product_head ul li[data-name="产品"]').addClass('active');

    if (!is_admin){
        $('.backstage1').hide();
        $('.backstage2').hide();
    }else {
        $('.backstage1').show();
        $('.backstage2').show();
    }

    //辅助下单模态框
    var userData = {}
    var choose_user = '';
    $('.order_btn').click(function () {
        $('#placeanorder').modal('show')
        console.log( $('.order_btn').data('shuju'))

        console.log( $('.order_btn').data('code'))

        $.ajax({
            type: 'get',
            url: base_url + '/zion/assist/customer',
            data: {'code':$('.order_btn').data('code')},
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log(res.body)
                userData = res.body;
                var userhtml = '';
                // 之前投资人隐藏
                if (userData.length<1){
                    $('.modal-left').css('display','none')
                    $('.modal-right').css({'float':'none','margin':'0 auto'})
                }else {
                    $('.modal-left').css('display','block')
                }


                $.each(res.body,function (i,item) {
                    userhtml += '<tr class="choose"> <td class="w_110">'+item.first_name+'   '+item.last_name+'</td>' +
                        ' <td class="w_178">'+item.phone+'</td> </tr>'
                })
                $('.order_info').html(userhtml)
                $('.user_table').css('overflow-y','scroll')
            },
            error: function () {
            }
        })

    })

    //选择投资人按钮
    $('body').on('click','.choose',function () {
        $('.choose_user').removeAttr("disabled");
        $(this).addClass('user_active').siblings().removeClass('user_active')
        choose_user = $(this).index()
    })




    //选择投资人按钮
    $('.choose_user').click(function () {

        if (userData[choose_user]){
            window.location.href = $('.order_btn').data('shuju')+'&phone='+userData[choose_user].phone;
        }else{
            alert('请选择投资人')
        }

    })

    //新建投资人按钮
    $('.new_user').click(function () {
        window.location.href = $('.order_btn').data('shuju');
    })

    //分享模态框
    $('.share').click(function () {
        $('#share').modal('show')
    })
    //入金模态框
    $('body').on('click','.payway', function (){
        $('.bs-example-modal-lg').modal('show')
    })
    //分享了链接改变 二维码
    $('#select1').change(function () {



        // 兼容ie
        if (window["context"] == undefined) {
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            window["context"] = location.origin+"/V6.0";
        }




        $('.sharelink').attr("value",window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+$('#select1').val())

        $.ajax({
            type: 'get',
            url: base_url + '/channel/qrcode/create',
            data: {"content":window.location.origin+"/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+$('#select1').val()},
            contentType: "application/json; charset=utf-8",
            headers: {
                "mx_token": $.cookie('mx_token'),
                "mx_secret": $.cookie('mx_secret')
            },
            success: function (res) {
                console.log(res.body)
                $('#QRcode').attr( 'src',res.body )
            },
            error: function () {
            }
        })

    })
    //辅助下单改变
    $('#select2').change(function () {
//            $('.assist').attr("href","https://invest.meixinglobal.com/invest.html?product_id="+getUrlParam('product_id')+"&partner_id="+$('#select2').val())

        // 兼容ie
        if (window["context"] == undefined) {
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            window["context"] = location.origin;
        }

        $('.order_btn').data('shuju',window.location.origin+"/auxiliary_order/stepOne.html?product_id="+getUrlParam('product_id')+"&channel_code="+$('#select2').val())
        $('.order_btn').data('code',$('#select2').val())
    })

    //关闭按钮至disabled
    $('.close_on').click(function () {
        $('.choose_user').attr('disabled',"disabled");
    })

    //复制分享链接
    var clipboard = new Clipboard('#copy');
    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        alert("复制成功");
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });



}