$(function () {
    $("#signature-line").jSignature({width: '100%', height: '10em'});
    var jSignatureData = $('#signature-line').jSignature('getData');
    var order_number = getUrlParam('order_number') || '';
    var product_id = getUrlParam('product_id') || '';
    getData({
        url: base_url + '/white_label/product_info',
        data: {product_id: product_id},
        sucFn: getProductSuc,
        failFn: failFn
    });

    $('.beforeOpen input').focus(function () {
        $(this).css('border', '1px solid #ccc');
    });
    $('.beforeOpen button').on('click', function () {
        var verifyCode = $('.beforeOpen input').val();
        if (verifyCode != '') {
            getData({
                url: base_url + '/zion/assist/openSignature',
                data: {orderNumber: order_number, verifyCode: verifyCode},
                sucFn: getUserData,
                failFn: failFn
            });
        } else {
            $('.beforeOpen input').css('border', '1px solid red');
        }

    });
    // 点击'点击查看投资信息'查看投资信息
    $('.show-user-info a').on('click',function () {
       $(this).hide();
       $('.user-info').show();
    });
    $('.hide-info').on('click',function () {
        $('.user-info').hide();
        $('.show-user-info a').show();
    });
    // 输入解锁密码打开签名页面
    function getUserData(res) {
        var d = res.body;
        if (d && d != null) {
            $('.beforeOpen').hide();
            $('#signaturePage').show();
            $('.product_name').html(d.product_name);
            $('.return_rate').html('预计年化收益：' + d.return_rate + '%');
            $('.invest_term').html('投资期限：' + d.invest_term + '个月');
            $('.invest_value span').html(d.invest_amount);
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
                $('.bank_name').html(bank_us.bank_name);
                $('.bank_address').html(bank_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('.routing_number').show().html(bank_us.routing_number);
                $('.swift_code').html(bank_us.swift_code);
                $('.account_number').html(bank_us.account_number.replace(/^\d+(\d{4})$/, "****************$1"));
            } else {
                var ban_non_us = d.order_user_info.ban_non_us;
                $('.bank_name').html(ban_non_us.bank_name);
                $('.bank_address').html(ban_non_us.bank_address.replace(/\r\n|\r|\n/, ', '));
                $('.swift_code').html(ban_non_us.swift_code);
                $('.account_number').html(ban_non_us.account_number.replace(/^\d+(\d{4})$/, "****************$1"));
                if (ban_non_us.have_middle_bank) {
                    $('.middle_bank').show();
                    $('.middle_bank_name').html(ban_non_us.middle_bank_name);
                    $('.middle_bank_address').html(ban_non_us.middle_bank_address);
                    $('.middle_bank_swift_code').html(ban_non_us.middle_bank_swift_code);
                }
            }
            var document_list='';
            $.each(d.product_document,function (index,item) {
                if(item.need_mapped){

                }
            })


        }
    }

    function getProductSuc(res) {
        var d = res.body;
        if (d) {
            $('.beforeOpen p').html('请输入密码打开“' + d.name + '”产品投资文件');
        }
    }

    function failFn(res) {
        alert(res.msg);
    }
});