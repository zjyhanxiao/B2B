$(function () {
    $('#product_head ul li[data-name="订单"]').addClass('active');
    var order_id = getUrlParam('order_id');
    var product_id = '', order_number;
    var failRemark = '';
    // 取订单信息
    getData({
        url: base_url + '/zion/order/amount',
        data: {order_id: order_id},
        headers: {
            mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
        },
        async: false,
        sucFn: getOrderSuc,
        failFn: failFn
    });
    // 取订单文档信息
    getData({
        url: base_url + '/zion/order/document',
        data: {order_id: order_id, product_id: product_id},
        headers: {
            mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
        },
        sucFn: getDocumentSuc,
        failFn: failFn
    });
    // 订单状态未签署和未入金，管理员可以取消订单
    $('.cancel_order').on('click', function () {
        if (!is_admin) {
            return false;
        } else {
            $('#myModal .modal-body').html(
                '<p style="color: #223976; font-size: 16px;">订单' + order_number + '</p>' +
                '<p style="color: #ff3300; font-size: 16px;">请输入' + order_number + '确定您要取消的订单。订单一旦取消不可复原！</p>' +
                '<input type="text" id="cancel-order-number" class="form-control">'
            );
            $('#myModal').modal('show');
            $('#cancel_order').on('click', function () {
                $(this).prop('disabled', true);
                getData({
                    url: base_url + '/zion/order/cancel',
                    data: {order_number: order_number},
                    headers: {
                        mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                    },
                    sucFn: cancelSuc,
                    failFn: cancelFail
                });
            });
            function cancelSuc() {
                window.location.reload();
            }

            function cancelFail(res) {
                $('#cancel_order').prop('disabled', false);
                alert(res.msg);
            }
        }
    });
    $('.about_order').on('click', function () {
        if (is_admin) {

        } else {
            alert('您没有该权限')
        }
        return false;
    });

    // 获取订单信息
    function getOrderSuc(res) {
        var d = res.body;
        if (d && d != null) {
            product_id = d.product_id;
            order_number = d.order_number;
            var created_at = d.created_at != null ? d.created_at : '',
                fa_investment_status = d.fa_investment_status != null ? d.fa_investment_status : '',
                product_name = d.product_name != null ? d.product_name : '',
                product_number = d.product_number != null ? d.product_number : '',
                first_name = d.first_name != null ? d.first_name : '',
                last_name = d.last_name != null ? d.last_name : '',
                invest_amount = d.invest_amount != null ? '$' + d.invest_amount : 0,
                advisor_name = d.advisor_name != null ? d.advisor_name : '',
                advisor_code = d.advisor_code != null ? d.advisor_code : '',
                remain_amount = d.remain_amount != null ? '$' + d.remain_amount : 0,
                close_fund_start_interest_day = d.close_fund_start_interest_day != null ? d.close_fund_start_interest_day : '';
            if (fa_investment_status == 'audit_failed') {
                getData({
                    url: base_url + '/zion/order/failedRemark',
                    data: {order_number: order_number},
                    headers: {
                        mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                    },
                    sucFn: failedRemark,
                    failFn: failFn
                });
            }
            var dom = '<div class="row">' +
                '<div class="col-md-6 about_product_left">' +
                '<span class="line"></span><span>订单 ' + order_number + '</span>' +
                '<p>投资日期：' + created_at + '</p></div>' +
                '<div class="col-md-6 about_product_right text-right">';
            if (fa_investment_status == 'not_commit') {
                fa_investment_status = '<span style="color: #ff6600">未签署</span>'
            }
            if (fa_investment_status == 'not_received') {
                fa_investment_status = '<span style="color: #ff6600">未入金</span>'
            }
            if (fa_investment_status == 'start_audit') {
                fa_investment_status = '<span style="color: #ff9933">审核中</span>'
            }
            if (fa_investment_status == 'audit_failed') {
                fa_investment_status = '<span style="color: #fa2a2a">审核失败</span>'
            }
            if (fa_investment_status == 'audit_success') {
                fa_investment_status = '<span style="color: #33cc33">审核通过</span>'
            }
            if (fa_investment_status == 'start_interest') {
                fa_investment_status = '<span style="color: #4faeff">投资中</span>'
            }
            if (fa_investment_status == 'refunded') {
                fa_investment_status = '<span style="color: #555">投资结束</span>'
            }
            if (fa_investment_status == 'voided') {
                fa_investment_status = '<span style="color: #fa2a2a">已取消</span>'
            }
            dom += fa_investment_status + '<a href="javascript:;" class="status_notes"></a>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="order-product-detail">' +
                '<div class="col-md-6">' +
                '<label>产品</label>' +
                '<a href="/productDetails.html?product_id=' + product_id + '">' + product_name + ' ' + product_number + '</a>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>投资顾问</label>' +
                '<a href="javascript:;">' + advisor_name + ' [' + advisor_code + '] </a>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>投资人</label>' +
                '<a href="javascript:;">' + first_name + ' ' + last_name + '</a>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>投资金额</label><span>' + invest_amount +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>起息日期</label>' +
                '<span>' + close_fund_start_interest_day + '</span></div>';
            if (d.fa_investment_status == 'start_audit' ||
                d.fa_investment_status == 'audit_failed' ||
                d.fa_investment_status == 'audit_success' ||
                d.fa_investment_status == 'start_interest' ||
                d.fa_investment_status == 'refunded'
            ) {
                dom += '<div class="col-md-6">' +
                    '<label>入金余额<a href="javascript:;" style="margin-left: 10px;" class="status_notes" title="入金余额为收到的多余资金。此金额不算在投资之内并在投资结束时与本金一并返回投资人的银行账户。"></a></label>' +
                    '<span>' + remain_amount + '</span></div>'
            }
            dom += '</div></div></div>';
            $('.about_product').html(dom);
            if (d.fa_investment_status &&
                (d.fa_investment_status == 'not_commit' ||
                d.fa_investment_status == 'not_received')) {
                var order_control = '<div class="row">' +
                    '<div class="col-md-6 about_product_left">' +
                    '<span class="line"></span><span>订单处理</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-md-12">';
                if (is_admin) {
                    order_control += '<button' +
                        'data-order="' + order_number + '" data-toggle="modal" data-target="#myModal" class="cancel_order">取消订单</button>';
                }
                order_control += '</div>' +
                    '</div>';
                $('.about_order').html(order_control);
            }
        }
    }

    // 获取文档信息
    function getDocumentSuc(res) {
        var d = res.body;
        if (d && d != null) {
            var dom = '<div class="row">' +
                '<div class="col-md-6 about_product_left">' +
                '<span class="line"></span><span>投资文件</span>' +
                '</div>' +
                '</div>' +
                '<div class="row document_list">';
            $.each(d, function (index, item) {
                if (item.document_url != '') {
                    if (item.document_name == 'ID_CARD') {
                        dom += '<div class="col-md-12"><a href="' + item.document_url + '" target="_blank">身份证</a></div>';
                        return true;
                    }
                    if (item.document_name == 'PASSPORT') {
                        dom += '<div class="col-md-12"><a href="' + item.document_url + '" target="_blank">护照</a></div>';
                        return true;
                    }
                    dom += '<div class="col-md-12"><a href="' + item.document_url + '" target="_blank">' + item.document_name + '</a></div>';
                }
            });
            dom += '</div>';
            $('.about_file').html(dom);
            return false;
        }
    }

    // 获取审核失败原因
    function failedRemark(res) {
        if (res.body != null) {
            failRemark = res.body;
        }
    }

    // 请求失败执行
    function failFn(res) {
        alert(res.msg)
    }
});