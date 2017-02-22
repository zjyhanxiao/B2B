$(function () {
    $('#product_head ul li[data-name="订单"]').addClass('active');
// 回车提交数据
    /*    $(window).keydown(function (event) {
     if (event.keyCode == 13) {
     $('.search').click();
     }
     });*/
    // 如果是主渠道 ，筛选条件显示投资顾问，订单列表显示投资顾问，否则不显示
    if (is_admin) {
        $('.adviser').html('<label for="adviser">投资顾问</label>' +
            '<input type="text" class="form-control" id="adviser" placeholder="名称／编号">');
        $('.order-list thead').html(
            '<th>订单号</th>' +
            '<th style="width: 130px;">产品名称</th>' +
            '<th>产品编号</th>' +
            '<th>客户姓名</th>' +
            '<th style="width: 132px;">客户电话</th>' +
            '<th style="width: 4em;">金额</th>' +
            '<th style="width: 5em;">投资顾问</th>' +
            '<th style="width: 5em;">顾问编号</th>' +
            '<th style="width: 100px;">状态</th>' +
            '<th style="width: 100px;">投资日期</th>'
        )
    } else {
        $('.adviser').html('');
        $('.order-list thead').html(
            '<th>订单号</th>' +
            '<th>产品名称</th>' +
            '<th>产品编号</th>' +
            '<th>客户姓名</th>' +
            '<th style="width: 132px;">客户电话</th>' +
            '<th style="width: 5em;">金额</th>' +
            '<th style="width: 100px;">状态</th>' +
            '<th style="width: 100px;">投资日期</th>'
        )
    }

    if (window.location.search == '') {  // 不是从其他页面跳转进来的，默认请求该所有订单数据
        $('.checkbox input[type="checkbox"]').each(function (i, item) {
            if (i < 6) { // 默认显示前6项
                $(item).prop('checked', true)
            } else {
                $(item).prop('checked', false)
            }
        });
        var status = "not_commit, not_received, start_audit, audit_failed, audit_success, start_interest";
        var data = {status: status};
        getOrderList(data);
    } else {  // 从其他页面跳转进来的，请求附带参数的订单数据
        var data = {};
        var search_user = getUrlParam('user') || '';
        var search_product = getUrlParam('product') || '';
        var search_channel_advisor_name = getUrlParam('channel') || '';
        data.user = search_user;
        data.product = search_product;
        data.channel_advisor_name = search_channel_advisor_name;

        $('#product').val(search_product);
        $('#user').val(search_user);
        if (is_admin) {
            $('#adviser').val(search_channel_advisor_name);
        }
        var search_status = "not_commit, not_received, start_audit, audit_failed, audit_success, start_interest";
        data.status = search_status;
        getOrderList(data);
    }
    // 选择日期范围
    $('#invest-date').dateRangePicker({
        batchMode: 'week-range',
        showShortcuts: false,
        separator: ' 至 '
    });
    // 清空搜索条件
    $('.clear-search').on('click', function () {
        $('#order-number').val('');
        $('#adviser').val('');
        $('#user').val('');
        $('#product').val('');
        $('#invest-date').val('');
        $('.checkbox input[type="checkbox"]').each(function (i, item) {
            if (i < 6) { // 默认显示前6项
                $(item).prop('checked', true)
            } else {
                $(item).prop('checked', false)
            }
        });
        return false;
    });
    $('.search').on('click', function () {
        $(this).prop('disabled', true);
        var data = {}, arr = [];
        var checkedBox = $('.checkbox input[type="checkbox"]:checked'); //获取选中的筛选条件checkbox
        $.each(checkedBox, function () {
            arr.push($(this).data('status'))
        });

        data.number = $('#order-number').val() || '';
        data.product = $('#product').val() || '';
        data.channel_advisor_name = $('#adviser').val() || '';
        data.user = $('#user').val() || '';
        data.begin = $('#invest-date').val().split(' 至 ')[0] || '';
        data.end = $('#invest-date').val().split(' 至 ')[1] || '';
        data.status = arr.join(', ');
        getOrderList(data);
        return false;
    });
    function getOrderList(data) {
        getData({
            url: base_url + '/zion/order/list',
            data: data,
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            contentType: "application/json; charset=utf-8",
            sucFn: order_list,
            failFn: order_fail
        });
    }

    // 获取订单列表成功回调
    function order_list(data) {
        if (data.body && data.body.length > 0) {
            /*var jsonData = $.grep(data.body, function (n, i) {
             return i > 2000;
             }, true);*/
            var jsonData = data.body;
            if (is_admin) {// 管理员和客户分别渲染不同数据
                admin_order_list(jsonData)
            } else {
                non_admin_order_list(jsonData)
            }
        } else {
            $('.order-list tbody').html('无数据！')
        }
        $('.search').prop('disabled', false);
    }

    // 写入管理员的订单列表信息
    function admin_order_list(data) {
        $('.order-list tbody').html('');
        var html = '';
        $.each(data, function (i, item) {
            var advisor_name = item.advisor_name != null ? item.advisor_name : '',
                phone = item.phone != null ? item.phone : '',
                product_number = item.product_number != null ? item.product_number : '',
                product_name = item.product_name != null ? item.product_name : '',
                invest_amount = item.invest_amount != null ? item.invest_amount : '',
                first_name = item.first_name != null ? item.first_name : '',
                last_name = item.last_name != null ? item.last_name : '',
                fa_investment_status = item.fa_investment_status != null ? item.fa_investment_status : '',
                created_at = item.created_at != null ? item.created_at : '',
                order_number = item.order_number != null ? item.order_number : '';
            if (fa_investment_status == 'not_commit') {
                fa_investment_status = '未签署'
            }
            if (fa_investment_status == 'not_received') {
                fa_investment_status = '未入金'
            }
            if (fa_investment_status == 'start_audit') {
                fa_investment_status = '审核中'
            }
            if (fa_investment_status == 'audit_failed') {
                fa_investment_status = '审核失败'
            }
            if (fa_investment_status == 'audit_success') {
                fa_investment_status = '审核通过'
            }
            if (fa_investment_status == 'start_interest') {
                fa_investment_status = '投资中'
            }
            if (fa_investment_status == 'refunded') {
                fa_investment_status = '投资结束'
            }
            if (fa_investment_status == 'voided') {
                fa_investment_status = '已取消'
            }
            html +=
                '<tr>' +
                '<td><a href="/orderDetails.html?order_number=' + order_number + '">' + order_number + '</a></td>' +
                '<td><a href="/productDetails.html?product_id=' + item.product_id + '">' + product_name + '</a></td>' +
                '<td>' + product_number + '</td>' +
                '<td><a href="/customerDetails.html?phone=' + phone + '">' + first_name + ' ' + last_name + '</a>' +
                '<td>' + phone + '</td>' +
                '<td>' + invest_amount + '</td>' +
                '<td>' + advisor_name + '</td>' +
                '<td>' + advisor_name + '</td>' +
                '<td>' + fa_investment_status + '</td>' +
                '<td>' + created_at + '</td>' +
                '</tr>'
        })
        $('.order-list tbody').html(html);
    }

    // 写入非管理员的订单列表信息
    function non_admin_order_list(data) {
        $('.order-list tbody').html('')
        var html = '';
        $.each(data, function (i, item) {
            var
                phone = item.phone != null ? item.phone : '',
                product_number = item.product_number != null ? item.product_number : '',
                product_name = item.product_name != null ? item.product_name : '',
                invest_amount = item.invest_amount != null ? item.invest_amount : '',
                first_name = item.first_name != null ? item.first_name : '',
                last_name = item.last_name != null ? item.last_name : '',
                fa_investment_status = item.fa_investment_status != null ? item.fa_investment_status : '',
                created_at = item.created_at != null ? item.created_at : '',
                order_number = item.order_number != null ? item.order_number : '';
            if (fa_investment_status == 'not_commit') {
                fa_investment_status = '未签署'
            }
            if (fa_investment_status == 'not_received') {
                fa_investment_status = '未入金'
            }
            if (fa_investment_status == 'start_audit') {
                fa_investment_status = '审核中'
            }
            if (fa_investment_status == 'audit_failed') {
                fa_investment_status = '审核失败'
            }
            if (fa_investment_status == 'audit_success') {
                fa_investment_status = '审核通过'
            }
            if (fa_investment_status == 'start_interest') {
                fa_investment_status = '投资中'
            }
            if (fa_investment_status == 'refunded') {
                fa_investment_status = '投资结束'
            }
            if (fa_investment_status == 'voided') {
                fa_investment_status = '已取消'
            }
            html +=
                '<tr>' +
                '<td><a href="/orderDetails.html?order_number=' + order_number + '">' + order_number + '</a></td>' +
                '<td><a href="/productDetails.html?product_id=' + item.product_id + '">' + product_name + '</a></td>' +
                '<td>' + product_number + '</td>' +
                '<td>' + first_name + ' ' + last_name + '</td>' +
                '<td>' + phone + '</td>' +
                '<td>' + invest_amount + '</td>' +
                '<td>' + fa_investment_status + '</td>' +
                '<td>' + created_at + '</td>' +
                '</tr>'
        })
        $('.order-list tbody').html(html);
    }

    //  获取订单失败执行
    function order_fail(res) {
        $('.search').prop('disabled', false);
        alert(res.msg)
    }
});