/**
 * Created by robot on 2017/2/21.
 */
//    var base_url = 'http://192.168.1.102:8001';
//    var base_url = 'https://zion-api.meixincn.com';
$(function () {

    $.ajax({
        type: 'get',
        url: base_url + '/channel/product/list',
        contentType: "application/json; charset=utf-8",
        headers: {
            "mx_token": $.cookie('mx_token'),
            "mx_secret": $.cookie('mx_secret')
        },
        success: function (res) {
            console.log( res.body )
            var dom='',dom11='',domTitle='',domBody='',tableDom='';
            var ele = $('<div class="product_chunk"></div>');
            for (var key in res.body){
                console.log(key)
                dom11='';
                domBody = '';
                domTitle='<h3>'+key+'</h3>'
                for (var val in res.body[key]){
                    console.log(val)
                    tableDom='';
                    var big = '';
                    var small = '';
                    domBody='<tr class="table_th">' +
                        '<th>'+val+'</th>' +
                        '<th>预计年化</th>' +
                        '<th>投资期限</th>' +
                        '<th>起息时期</th>' +
                        '<th>开售日期</th>' +
                        '<th>停售日期</th>'+
                        '<th></th>'+
                        '</tr>'
                    console.log(res.body[key][val])
                    if (res.body[key][val].length>3){
                        $.each(res.body[key][val],function (j,jtem) {
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
                            if (j>2){

                                big += '<tr class="big hover"><td><a href="productDetails.html?product_id='+jtem.id+'" class="color_223976">'+jtem.number+'</a></td>' +
                                    '<td>'+jtem.return_rate+'%</td>' +
                                    '<td>'+jtem.invest_term+'个月</td>' +
                                    '<td>'+jtem.close_fund_start_interest_day+'</td>' +
                                    '<td>'+jtem.start_sale_day+'</td>' +
                                    '<td>'+jtem.end_sale_day+'</td>' +
                                    '<td class="">'+statu+'</td></tr>';
                            } else {

                                small += '<tr class="hover"><td><a href="productDetails.html?product_id='+jtem.id+'" class="color_223976">'+jtem.number+'</a></td>' +
                                    '<td>'+jtem.return_rate+'%</td>' +
                                    '<td>'+jtem.invest_term+'个月</td>' +
                                    '<td>'+jtem.close_fund_start_interest_day+'</td>' +
                                    '<td>'+jtem.start_sale_day+'</td>' +
                                    '<td>'+jtem.end_sale_day+'</td>' +
                                    '<td class="">'+statu+'</td></tr>';
                            }
                            tableDom = small + big + '<tr> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td class="unfold color_223976">查看其他售罄产品 <i class="glyphicon glyphicon-menu-down"></i></td> </tr>'
                            console.log('11111111111111'+tableDom)
                        })
                        dom11+='<table>'+domBody+tableDom+'</table>'
                    }else {

                        $.each(res.body[key][val],function (j,jtem) {
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
                            tableDom+='<tr class="hover"><td><a href="productDetails.html?product_id='+jtem.id+'" class="color_223976">'+jtem.number+'</a></td>' +
                                '<td>'+jtem.return_rate+'%</td>' +
                                '<td>'+jtem.invest_term+'个月</td>' +
                                '<td>'+jtem.close_fund_start_interest_day+'</td>' +
                                '<td>'+jtem.start_sale_day+'</td>' +
                                '<td>'+jtem.end_sale_day+'</td>' +
                                '<td class="">'+statu+'</td></tr>';
                        })
                        dom11+='<table>'+domBody+tableDom+'</table>' ;
                    }
//                    tableDom=domBody
                    dom=domTitle+dom11;
                }
                $('.product_main').append(dom)
            }
        },
        error:function () {
        }
    })

})

window.onload = function () {

    $('#product_head ul li[data-name="产品"]').addClass('active');


    //列表显示隐藏函数
    $('body').on('click','.unfold', function () {
        $(this).closest('table').find('tr.big').show();
        $(this).html('隐藏其他售罄产品 <i class="glyphicon glyphicon-menu-up"></i>');
        $(this).removeClass('unfold').addClass('fold');
    }) ;
    $('body').on('click','.fold', function () {
        $(this).closest('table').find('tr.big').hide();
        $(this).html('显示其他售罄产品 <i class="glyphicon glyphicon-menu-down"></i>');
        $(this).removeClass('fold').addClass('unfold');
    })

}







