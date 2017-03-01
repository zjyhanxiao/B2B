$(function () {
    $('#product_head ul li[data-name="产品"]').addClass('active');

    var user_data = {}; // 定义用户信息数据
    var user_phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    if (order_number != '' && $('.about_order').length) {
        $('.about_order').html('<span>订单</span>' + order_number);
    }

    /**************************** 返回第三步 ******************************/
    $('.prev-three').on('click', function () {
        window.location = '/auxiliary_order/stepThree.html?' +
            'product_id=' + product_id + '&phone=' + user_phone + '&partner_id=' + partner_id + '&order_number=' + order_number;
    });

    /**************************** 提交第四步数据 ******************************/
    $('.step-four').on('click', function () {
        $(this).prop('disabled', true);
        var invest_value = parseInt($('.invest-amounts').val());
        if (invest_value < minimum_invest_amount) {
            alert('投资金额不能少于' + minimum_invest_amount);
            $(this).prop('disabled', false);
            return false;
        }
        if (invest_value % invest_par_value != 0) {
            alert('投资金额必须为' + minimum_invest_amount + '的整数倍');
            $(this).prop('disabled', false);
            return false;
        }

        user_data.payment_method = $('#invest-info .payment input:checked').val();
        user_data.channel_code = partner_id;
        user_data.product_id = product_id;
        user_data.phone = user_phone;
        user_data.order_number = order_number;
        user_data.invest_amount = invest_value;
        postData({
            url: base_url + '/zion/assist/operateUser',
            data: JSON.stringify(user_data),
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            contentType: "application/json; charset=utf-8",
            sucFn: stepFourSuccess,
            failFn: getFail
        });
        return false;
    });
    function stepFourSuccess(res) {
        var d = res.body;
        if (d) {
            window.location = '/auxiliary_order/share.html?product_id=' + product_id + '&partner_id=' + partner_id + '&verify_code=' + d.verify_code + '&order_number=' + order_number + '&phone=' + user_phone;
        }
    }

    var invest_par_value, minimum_invest_amount;

    /***************************** 辅助下单获取产品信息 *****************************/
    if (product_id != '') {
        getData({
            url: base_url + '/white_label/product_info',
            data: {product_id: product_id},
            async: false,
            sucFn: getProductSuc,
            failFn: getFail
        });
    }

    /***************************** 辅助下单获取支付方式 *****************************/
    var ach = false;
    if (product_id != '') {
        getData({
            url: base_url + '/white_label/product/payment_list',
            data: {product_id: product_id},
            async: false,
            sucFn: getPaymentSuc,
            failFn: getFail
        });
    }
    function getPaymentSuc(res) {
        var d = res.body;
        if (d) {
            ach = d.is_ach_enabled;
        }
    }

    /***************************** 辅助下单获取用户信息 *****************************/
    if (user_phone != '') {
        getData({
            url: base_url + '/zion/assist/customerInfo',
            data: {phone: user_phone},
            headers: {
                mx_secret: $.cookie('mx_secret'), mx_token: $.cookie('mx_token')
            },
            sucFn: baseInfo,
            failFn: getFail
        })
    }

    function getProductSuc(res) {
        var d = res.body;
        if (d && d != null) {
            if (d.status !== 'FOR_INVEST') {
                window.location = '/auxiliary_order/errLink.html';
                return false;
            }
            invest_par_value = d.invest_par_value || 0;
            minimum_invest_amount = d.minimum_invest_amount || 0;
            $('.about_product').html('<span>' + res.body.name + '</span>' + res.body.number);
            $('.product-rate').html('预计年化收益: ' + d.return_rate + '%');
            $('.product-deadline').html('投资期限: ' + d.invest_term + '个月');
            $('.invest-amounts').val(minimum_invest_amount);
            $('.invest-par-value').html(invest_par_value);
        }
    }

    function baseInfo(res) {
        var d = res.body;
        if (d && d != null) {
            user_data = d;
            $('#get-name').html(d.first_name + ' ' + d.last_name);
            $('#get-phone').html(d.phone);
            $('#get-email').html(d.email);
            if (d.base_info != null) {
                $('#get-date-of-birth').html(d.base_info.date_of_birth);
                $('#get-source-of-income').html(d.base_info.source_of_capital);
                $('#get-industry').html(d.base_info.industry);
                $('#get-occupation').html(d.base_info.occupation);
            }
            $('#get-passport-number').html(d.passport_number);
            $('#get-effective').html(d.passport_expire_date);
            if (d.address_cn != null) {
                $('.get-address-line1').html(d.address_cn.region + ' ' + d.address_cn.city + ' ' + d.address_cn.district);
                $('.get-address-line2').html(d.address_cn.detail.replace(/\r\n|\r|\n/, ', '));
                $('.get-address-line3').html(d.address_cn.postal_code);
            }
            if (d.bank_type == 'US') {
                $('#get-bank-aba').show();
                $('.get-middle-bank').hide();
                $('#get-bank-name').html(d.bank_us.bank_name);
                $('#get-bank-address').html(d.bank_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('#get-Swift-code').html(d.bank_us.swift_code);
                $('#get-aba').html(d.bank_us.routing_number);
                $('#get-bank-user-name').html(d.first_name + ' ' + d.last_name);
                $('#get-bank-user-account').html(d.bank_us.account_number.replace(/^\d+(\d{4})$/, "****************$1"));
                if (ach) {
                    $('#invest-info .payment').html('<p style="color: #000;margin-bottom: 5px;">入金方式只能选择其中一项：</p><div class="radio">'+
                        '<label>'+
                        '<input type="radio" name="optionsRadios" checked value="ach">通过ACH自动从'+d.bank_us.bank_name+'（' + d.bank_us.account_number.replace(/^\d+(\d{4})$/, "$1") + '）扣款'+
                    '</label>'+
                    '</div>'+
                    '<div class="radio">'+
                        '<label>'+
                        '<input type="radio" name="optionsRadios" value="wire">通过银行电汇线下打款'+
                    '</label>'+
                    '</div>');
                } else {
                    $('#invest-info .payment').html('<div class="checkbox"><label><input type="checkbox" checked value="wire" disabled>通过银行电汇线下打款</label></div>');
                }
            } else {
                $('#get-bank-aba').hide();
                $('#get-bank-name').html(d.bank_non_us.bank_name);
                $('#get-bank-address').html(d.bank_non_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('#get-Swift-code').html(d.bank_non_us.swift_code);
                if (d.bank_non_us.have_middle_bank) {
                    $('.get-middle-bank').show();
                    $('#get-middle-bank-name').html(d.bank_non_us.middle_bank_name);
                    $('#get-middle-bank-address').html(d.bank_non_us.middle_bank_address.replace(/\r\n|\r|\n/, ', '));
                    $('#get-middle-bank-swift-code').html(d.bank_non_us.middle_bank_swift_code);
                } else {
                    $('.get-middle-bank').hide();
                }
                $('#get-bank-user-name').html(d.first_name + ' ' + d.last_name);
                $('#get-bank-user-account').html(d.bank_non_us.account_number.replace(/^\d+(\d{4})$/, "****************$1"));
                $('#invest-info .payment').html('<div class="checkbox"><label><input type="checkbox" checked value="wire" disabled>通过银行电汇线下打款</label></div>');
            }
        }
    }

    function getFail(res) {
        alert(res.msg)
    }

    $('.add').click(function () {
        $('.invest-amounts').val(parseInt($('.invest-amounts').val()) + invest_par_value);
    });

    $('.sub').click(function () {
        if ($('.invest-amounts').val() <= minimum_invest_amount) {
            $('.invest-amounts').val(minimum_invest_amount);
        } else {
            $('.invest-amounts').val(parseInt($('.invest-amounts').val()) - invest_par_value);
        }
    });
});
