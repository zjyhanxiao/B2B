$(function () {
    $('#product_head ul li[data-name="订单"]').addClass('active');
    var order_number = getUrlParam('order_number') || '';
    var product_id = '';
    var failRemark = ''; // 审核失败原因
    // 取订单信息
    getData({
        url: base_url + '/zion/order/amount',
        data: {order_number: order_number},
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
        data: {order_number: order_number, product_id: product_id},
        headers: {
            mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
        },
        sucFn: getDocumentSuc,
        failFn: failFn
    });
    $('.status_notes').on('click', function () {
        $('#myModalLabel').html($(this).data('title'));
        $('#myModal .modal-footer').hide();
        var html = '<div class="order_progress clearfix">' +
            '<div class="number">' +
            '<ul>' +
            '<li>1</li>' +
            '<li>2</li>' +
            '<li>3</li>' +
            '<li>4</li>' +
            '<li>5</li>' +
            '</ul>' +
            '</div>' +
            '<div class="describe">' +
            '<ul>' +
            '<li><span style="color: #ff0000">未入金</span>' +
            '<p>认购成功！请客户从Bank of American（5548）账户操作入金</p>' +
            '</li>' +
            '<li><span style="color: #ff6600">审核中</span>' +
            '<p>资金已经进入账户，开始对投资资料进行审核</p>' +
            '</li>';
        if ($(this).data('failed')) {
            html += '<li><span style="color: #f00">审核失败</span>' +
                '<p>审核失败，请按照提示解决订单问题。订单审核通过后才可以进入投资状态。</p>' +
                '</li>'
        } else {
            html += '<li><span style="color: #16bd16">审核通过</span>' +
                '<p>审核通过，等待投资起息</p>' +
                '</li>'
        }

        html += '<li><span style="color: #4faeff">投资中</span>' +
            '<p>投资开始计息</p>' +
            '</li>' +
            '<li><span style="color: #555">投资结束</span>' +
            '<p>投资结束，本金及利息将全部归还之客户的Bank of American（5548）账户</p>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>';
        var index = $(this).data('progress');
        $('#myModal .modal-body').html(html);
        $.each($('.number li'),function (i, item) {
            if (i < index - 1) {
                $(item).addClass('passing');
            }
            if (i == index - 1) {
                $(item).addClass('active');
            }
        });
        $('#myModal').modal('show');
        return false;
    });
    // 订单状态未签署和未入金，管理员可以取消订单
    $('.cancel_order').on('click', function () {
        $('#myModalLabel').html($(this).data('title'));
        $('#myModal .modal-body').html(
            '<p style="color: #223976; font-size: 16px;">订单' + order_number + '</p>' +
            '<p style="color: #ff3300; font-size: 16px;">请输入' + order_number + '确定您要取消的订单。订单一旦取消不可复原！</p>' +
            '<input type="text" id="cancel-order-number" class="form-control">'
        );
        $('#myModal .modal-footer').show();
        $('#myModal').modal('show');
        $('#cancel_order').on('click', function () {
            $('#cancel-order-number').css('border', '1px solid #ccc');
            $(this).prop('disabled', true);
            if ($('#cancel-order-number').val() == '') {
                $('#cancel-order-number').css('border', '1px solid red');
                $(this).prop('disabled', false);
                return false;
            } else {
                getData({
                    url: base_url + '/zion/order/cancel',
                    data: {order_number: $('#cancel-order-number').val()},
                    headers: {
                        mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                    },
                    sucFn: cancelSuc,
                    failFn: cancelFail
                });
            }
            return false;
        });
        function cancelSuc() {
            window.location.reload();
        }

        function cancelFail(res) {
            $('#cancel_order').prop('disabled', false);
            alert(res.msg);
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
                phone = d.phone != null ? d.phone : '',
                advisor_code = d.advisor_code != null ? d.advisor_code : '',
                remain_amount = d.remain_amount != null ? '$' + d.remain_amount : 0,
                close_fund_start_interest_day = d.close_fund_start_interest_day != null ? d.close_fund_start_interest_day : '';
            var invest_status, find_link, audit_failed, order_progress = '';
            if (fa_investment_status == 'not_commit') {
                invest_status = '<span style="color: #ff6600">未签署</span>';
                find_link = '<div class="row">' +
                    '<div class="col-md-12"><p style="text-align: right">' +
                    '<a href="/auxiliary_order/share.html?product_id=' + d.product_id + '&channel_code=' + d.advisor_code + '&phone=' + phone + '&verify_code=' + d.verify_code + '&order_number=' + order_number + '">查看签署链接</a></p></div>' +
                    '</div>';
            }
            if (fa_investment_status == 'not_received') {
                invest_status = '<span style="color: #ff6600">未入金</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-progress="1" data-title="当前投资进度"></a>';
            }
            if (fa_investment_status == 'start_audit' || fa_investment_status == 'received') {
                invest_status = '<span style="color: #ff9933">审核中</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-progress="2"  data-title="当前投资进度"></a>';
            }
            if (fa_investment_status == 'audit_failed') {
                invest_status = '<span style="color: #fa2a2a">审核失败</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-failed="true" data-progress="3"  data-title="当前投资进度"></a>';
                getData({
                    url: base_url + '/zion/order/failedRemark',
                    data: {order_number: order_number},
                    async: false,
                    headers: {
                        mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
                    },
                    sucFn: failedRemark,
                    failFn: failFn
                });
                audit_failed = '<div class="row">' +
                    '<div class="col-md-12"><p style="color: red; text-align: right"><span style="font-weight: 700;">失败原因：</span>' + failRemark + '</p></div>' +
                    '</div>';
            }
            if (fa_investment_status == 'audit_success' || fa_investment_status == 'invest_success') {
                invest_status = '<span style="color: #33cc33">审核成功</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-progress="3"  data-title="当前投资进度"></a>';
            }
            if (fa_investment_status == 'start_interest') {
                invest_status = '<span style="color: #4faeff">投资中</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-progress="4"  data-title="当前投资进度"></a>';
            }
            if (fa_investment_status == 'refunded' || fa_investment_status == 'closed') {
                invest_status = '<span style="color: #555">投资结束</span>';
                order_progress = '<a href="javascript:;" class="status_notes" data-progress="5"  data-title="当前投资进度"></a>';
            }
            if (fa_investment_status == 'voided') {
                invest_status = '<span style="color: #fa2a2a">已取消</span>'
            }
            var dom = '<div class="row">' +
                '<div class="col-md-6 about_product_left">' +
                '<span class="line"></span><span>订单 ' + order_number + '</span>' +
                '<p>投资日期：' + created_at + '</p></div>' +
                '<div class="col-md-6 about_product_right text-right">';

            dom += invest_status + order_progress +
                '</div>' +
                '</div>';


            if (fa_investment_status == 'audit_failed') {
                if (failRemark != '') {
                    dom += audit_failed;
                }
            }
            if (fa_investment_status == 'not_commit') {
                dom += find_link;
            }
            dom += '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="order-product-detail">' +
                '<div class="col-md-6">' +
                '<label>产品</label>' +
                '<a href="/productDetails.html?product_id=' + product_id + '">' + product_name + ' ' + product_number + '</a>' +
                '</div>' +
                '<div class="col-md-6">';
            if (is_admin) {
                dom += '<label>投资顾问</label>' +
                    '<a href="/backstageDetails.html?id=' + d.advisor_id + '&code=' + d.advisor_code + '">' + advisor_name + ' [' + advisor_code + '] </a>';
            }


            dom += '</div>' +
                '<div class="col-md-6">' +
                '<label>投资人</label>' +
                '<a href="/customerDetails.html?phone=' + d.phone + '">' + first_name + ' ' + last_name + '</a>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>投资金额</label><span>' + invest_amount +
                '</div>' +
                '<div class="col-md-6">' +
                '<label>起息日期</label>' +
                '<span>' + close_fund_start_interest_day + '</span></div>';
            if (fa_investment_status == 'start_audit' ||
                fa_investment_status == 'audit_failed' ||
                fa_investment_status == 'audit_success' ||
                fa_investment_status == 'invest_success' ||
                fa_investment_status == 'start_interest' ||
                fa_investment_status == 'received' ||
                fa_investment_status == 'start_interest' ||
                fa_investment_status == 'closed' ||
                fa_investment_status == 'refunded'
            ) {
                dom += '<div class="col-md-6">' +
                    '<label>入金余额<a href="javascript:;" style="margin-left: 10px;" class="status_notes" title="入金余额为收到的多余资金。此金额不算在投资之内并在投资结束时与本金一并返回投资人的银行账户。"></a></label>' +
                    '<span>' + remain_amount + '</span></div>'
            }
            dom += '</div></div></div>';
            $('.about_product').html(dom);
            if (fa_investment_status &&
                (fa_investment_status == 'not_commit' ||
                fa_investment_status == 'not_received')) {
                var order_control = '<div class="row">' +
                    '<div class="col-md-6 about_product_left">' +
                    '<span class="line"></span><span>订单处理</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-md-12">';
                if (fa_investment_status == 'not_commit') {
                    order_control += '<a style="display: block; margin-left: 13px; margin-bottom: 10px;" href="/auxiliary_order/stepOne.html?product_id=' + product_id + '&phone=' + phone + '&order_number=' + order_number + '&channel_code=' + advisor_code + '">修改订单</a>';
                }

                order_control += '<button' +
                    'data-order="' + order_number + '" data-toggle="modal" data-title="取消订单" data-target="#myModal" class="cancel_order">取消订单</button>';

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
        failRemark = res.body;
    }

    // 请求失败执行
    function failFn(res) {
        alert(res.msg)
    }
});