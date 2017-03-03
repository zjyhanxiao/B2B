$(function () {
    $("#signature-line").jSignature({width: 800, height: 200});       // 初始化签名框
    var jSignatureData = $('#signature-line').jSignature('getData');  // 获取签名默认base64数据
    var user_data = {};// 定义用户信息数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var access_token = getUrlParam('access_token') || ''; // 获取通行证
    var pdf = null;   // 定义获取pdf所需上传的数据
    var min_invest_amount = 0; // 最小投资金额
    var invest_par_value = 0;  // 增加单位
    var account_number = '';  // 账户号
    var bank_name = '';  // 银行名称
    var payment_method = ''; // 支付方式

    /**************************** 获取产品信息 ****************************/
    getData({
        url: base_url + '/white_label/product_info',
        data: {product_id: product_id},
        sucFn: getProductSuc,
        failFn: failFn
    });
    /***************************** 辅助下单获取支付方式 *****************************/
    var ach = false;
    if (product_id != '') {
        getData({
            url: base_url + '/white_label/product/payment_list',
            data: {product_id: product_id},
            async: false,
            sucFn: getPaymentSuc,
            failFn: failFn
        });
    }
    function getPaymentSuc(res) {
        var d = res.body;
        if (d) {
            ach = d.is_ach_enabled;
        }
    }

    getData({
        url: base_url + '/zion/common/openSignature',
        data: {order_number: order_number, phone: phone, channel_code: partner_id, access_token: access_token},
        async: false,
        sucFn: getUserData,
        failFn: failFn
    });

    // 点击'点击查看投资信息'查看投资信息
    $('.show-user-info a').on('click', function () {
        $(this).hide();
        $('.user-info').show();
    });
    // 点击'收起'隐藏投资信息
    $('.hide-info').on('click', function () {
        $('.user-info').hide();
        $('.show-user-info a').show();
    });

    /**************************** 提交签名信息 ****************************/
    $('#update_order').on('click', function () {
        $('#signature-box,.invest-amounts').css('border', '1px solid #ccc');
        $('.document-unCheck').remove();
        $(this).prop('disabled', true);
        var invest_amount = parseInt($('.invest-amounts').val());
        payment_method = $('.payment input:checked').val();
        if (invest_amount < min_invest_amount ||
            ((invest_amount - min_invest_amount) % invest_par_value != 0))
        {
            $('.invest-amounts').css('border-color', 'red');
            $('body').scrollTop($('.invest-amounts').offset().top);
            $(this).prop('disabled', false);
            return false;
        }
        var signature = $('#signature-line').jSignature('getData');
        if (signature == jSignatureData) {
            $(this).prop('disabled', false);
            $('#signature-box').css('border', '1px solid red');
            $('body').scrollTop($('#signature-box').offset().top);
            return false;
        }
        var update_data = {};
        update_data.order_number = order_number;
        update_data.signature = signature;
        update_data.channel_code = partner_id;
        update_data.invest_amount = invest_amount;
        update_data.payment_method = payment_method;
        update_data.phone = phone;
        update_data.access_token = access_token;
        postData({
            url: base_url + '/zion/common/updateSignature',
            data: JSON.stringify(update_data),
            contentType: "application/json; charset=utf-8",
            sucFn: updateSignature,
            failFn: failFn
        });
        return false;
    });
    function updateSignature(res) {
        window.location = '/invest_success.html?order_number=' + order_number + '&payment_method=' + payment_method + '&bank_name=' + bank_name + '&account_number=' + account_number+'&product_id='+product_id;
    }

    /**************************** 密码认证成功回调，渲染签名页面数据 ****************************/
    function getUserData(res) {
        var d = res.body;
        if (d && d != null) {
            $('#signaturePage').show();
            $('.product_name').html(d.product_name);
            $('.return_rate').html('预计年化收益：' + d.return_rate + '%');
            $('.invest_term').html('投资期限：' + d.invest_term + '个月');
            min_invest_amount = d.min_invest_amount;
            invest_par_value = d.invest_par_value;
            $('.invest-amounts').val(min_invest_amount);
            if (invest_par_value < 10000) {
                $('.invest-par-value').html(d.invest_par_value);
            } else {
                $('.invest-par-value').html(invest_par_value / 10000 + '万');
            }
            $('.product_name').html(d.product_name);
            $('.full_name').html(d.order_user_info.first_name + ' ' + d.order_user_info.last_name);
            $('.phone').html(d.order_user_info.phone);
            $('.email').html(d.order_user_info.email);
            var base_info = d.order_user_info.base_info;
            $('.date_of_birth').html(base_info.date_of_birth);
            $('.source_of_capital').html(base_info.source_of_capital);
            $('.industry').html(base_info.industry);
            $('.occupation').html(base_info.occupation);
            $('.passport_number').html(d.order_user_info.passport_number);
            $('.passport_expire_date').html(d.order_user_info.passport_expire_date);
            var address = d.order_user_info.address_cn;
            $('.line-1').html(address.region + ' ' + address.city + ' ' + address.district);
            $('.line-2').html(address.detail.replace(/\r\n|\r|\n/, ', '));
            $('.line-3').html(address.postal_code);
            if (d.order_user_info.bank_type == 'US') {
                var bank_us = d.order_user_info.bank_us;
                bank_name = bank_us.bank_name;
                $('.bank_name').html(bank_name);
                $('.bank_address').html(bank_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('.routing_number').show().html(bank_us.routing_number);
                $('.swift_code').html(bank_us.swift_code);
                account_number = bank_us.account_number.replace(/^\d+(\d{4})$/, "$1");
                $('.account_number').html('****************' + account_number);

            } else {
                var bank_non_us = d.order_user_info.bank_non_us;
                bank_name = bank_non_us.bank_name;
                $('.bank_name').html(bank_name);
                $('.bank_address').html(bank_non_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('.swift_code').html(bank_non_us.swift_code);
                account_number = bank_non_us.account_number.replace(/^\d+(\d{4})$/, "$1");
                $('.account_number').html('****************' + account_number);
                if (bank_non_us.have_middle_bank) {
                    $('.middle_bank').show();
                    $('.middle_bank_name').html(bank_non_us.middle_bank_name);
                    $('.middle_bank_address').html(bank_non_us.middle_bank_address);
                    $('.middle_bank_swift_code').html(bank_non_us.middle_bank_swift_code);
                }
                $('#invest_value .payment').html('<div class="checkbox"><label><input type="checkbox" checked value="wire" disabled>通过银行电汇线下打款</label></div>');
            }
            var document_list = '';
            pdf = d.order_user_info;
            $.each(d.product_document, function (index, item) {
                if (item.need_mapped) {
                    document_list += '<div class="checkbox">' +
                        '<a data-id="' + item.id + '" class="getPdf">' + item.document_name + '</a>' +
                        '</div>'
                } else {
                    document_list += '<div class="checkbox">' +
                        '<a data-url="' + item.document_url + '" class="getPdf">' + item.document_name + '</a>' +
                        '</div>'
                }
            });
            $('.document-item').html(document_list);
            if (ach && d.order_user_info.bank_type == 'US') {
                $('#invest_value .payment').html('<p style="color: #000;margin-bottom: 5px;">入金方式只能选择其中一项：</p><div class="radio">' +
                    '<label>' +
                    '<input type="radio" name="optionsRadios" checked value="ach">通过ACH自动从' + bank_name + '（' + account_number + '）扣款' +
                    '</label>' +
                    '</div>' +
                    '<div class="radio">' +
                    '<label>' +
                    '<input type="radio" name="optionsRadios" value="wire">通过银行电汇线下打款' +
                    '</label>' +
                    '</div>');
                $('.document-item').append('<div class="checkbox ach">' +
                    '<a data-url="/vendor/doc/ACH.pdf" class="getPdf">ACH自动扣款协议</a>' +
                    '</div>');
                $('.showAch').html('- 我确认' + bank_name + ' (' + account_number + ')账户里面有充足的资金并授权美信金融使用ACH从此账户扣款。');
            } else {
                $('#invest_value .payment').html('<div class="checkbox"><label><input type="checkbox" checked value="wire" disabled>通过银行电汇线下打款</label></div>');
            }
            /*if (d.payment_method) {
             if (d.payment_method == 'ach') {
             $('.payment').html('确认投资后将通过ACH自动从' + bank_us.bank_name + '（' + bank_us.account_number.replace(/^\d+(\d{4})$/, "$1") + '）扣款');
             if ($('.document-item .checkbox').length > 0) {
             $('.document-item').append('<div class="checkbox">' +
             '<label>' +
             '<input type="checkbox">我已阅读并接受' +
             '</label>' +
             '<a data-url="/vendor/doc/ACH.pdf" class="getPdf">ACH扣款协议</a>' +
             '</div>');
             } else {
             $('.document-item').prepend('<div class="checkbox">' +
             '<label>' +
             '<input type="checkbox">我已阅读并接受' +
             '</label>' +
             '<a data-url="/vendor/doc/ACH.pdf" class="getPdf">ACH扣款协议</a>' +
             '</div>');
             }

             } else {
             $('.payment').html('确认投资后将通过银行电汇线下打款');
             }
             }*/
        }
    }

    // Populate PDF Document
    function populatePDFDocument(url) {
        $('#document-loading').hide();
        $("#document-element-wrapper").html('<iframe id="document-preview-element" src="/vendor/pdfjs/web/viewer.html?file=' + url + '#page=1"></iframe>');
        $("#document-preview-element").width($(window).width());
        $("#document-preview-element").height($(window).height() - 45);
        $("#document-preview-element").css('margin-top', '40px');
    }

    /** Close when someone clicks on the "x" symbol inside the overlay **/
    function closeDocumentPreview() {
        $("#document-element-wrapper").html("");
        $("#document-preview").width("0%");
    }

    /**************************** 预览pdf文件 ****************************/
    $(".document-item").on('click', '.getPdf', function () {
        $("#document-preview").width("100%");
        $('#document-loading').show();

        var document_id = $(this).data('id');

        if (!document_id) {
            var document_url = $(this).data('url');
            populatePDFDocument(document_url);
            return;
        }

        pdf.document_id = document_id;
        //映射文档
        $.ajax({
            type: "post",
            url: base_url + '/channel/doc/preview',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(pdf),
            success: function (res) {
                populatePDFDocument(res.body);
            }
        });
        return false;
    });

    $("#document-preview .close-document-preview").click(function () {
        closeDocumentPreview();
    });
    function getProductSuc(res) {
        var d = res.body;
        if (d) {
            if (d.status !== 'FOR_INVEST') {
                window.location = '/auxiliary_order/errLink.html';
                return false;
            }
            $('.beforeOpen p').html('请输入密码打开“' + d.name + '”产品投资文件');
        }
    }

    function failFn(res) {
        alert(res.msg);
    }

    //  金额加减
    $('.add').click(function () {
        var incest_amounts = parseInt($('.invest-amounts').val());
        incest_amounts += invest_par_value;
        $('.invest-amounts').val(incest_amounts);
        if (incest_amounts <= min_invest_amount) {
            $('.sub').prop('disabled', true);
        } else {
            $('.sub').prop('disabled', false);
        }
        return false;
    });
    $('.sub').click(function () {
        var incest_amounts = parseInt($('.invest-amounts').val());
        if (incest_amounts <= min_invest_amount) {
            $(this).prop('disabled', true);
        } else {
            incest_amounts -= invest_par_value;
            if (incest_amounts < min_invest_amount) {
                return false;
            }
            $('.invest-amounts').val(incest_amounts);
        }
        return false;
    });
    // 支付方式切换
    $('.radio input[type="radio"]').on('change', function () {
        if ($(this).val() == 'ach') {
            $('.ach').empty();
            $('.document-info .ach').html('<a data-url="/vendor/doc/ACH.pdf" class="getPdf">ACH自动扣款协议</a>');
            $('.signature .ach').html('- 我确认' + bank_name + ' (' + account_number + ')账户里面有充足的资金并授权美信金融使用ACH从此账户扣款。');
        } else {
            $('.ach').empty();
        }
    });
});