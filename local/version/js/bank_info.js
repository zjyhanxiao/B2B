$(function () {
    var user_data = {};// 定义用户信息数据
    var phone = getUrlParam('phone') || ''; // 通过手机号查找用户信息
    var partner_id = getUrlParam('partner_id') || ''; // 渠道编码
    var product_id = getUrlParam('product_id') || ''; //获取产品id
    var order_number = getUrlParam('order_number') || ''; // 获取订单编号
    var voucher = getUrlParam('voucher') || ''; // 获取通行证

    $('')






    // 写入美国银行信息
    function writeBankUs(data) {
        $('.bank-us .bank_url img').attr('src', data.a);
        $('.bank-us .bank_name_en').html(data.bank_name_en);
        $('.bank-us .swift_code').html('SWIFT：' + data.swift_code);
        $('.bank-us .routing_number').val(data.routing_number);
        $('.bank-us .account_number').val(data.account_number);
        if (data.account_type == 'Savings') {
            $('.bank-us .account_type .savings').addClass('checked').siblings('.checking').removeClass('checked');
        } else {
            $('.bank-us .account_type .checking').addClass('checked').siblings('.savings').removeClass('checked');
        }
    }

    // 写入非美银行信息
    function writeBankCn(data) {
        $('.bank-cn .bank_url img').attr('src', data.a);
        $('.bank-cn .bank_name_cn').html(data.bank_name_cn);
        $('.bank-cn .bank_name_en').html(data.bank_name_en);
        $('.bank-cn .swift_code').html('SWIFT：' + data.swift_code);
        $('.bank-cn .account_number').val(data.account_number);
    }

    // 写入美国其他银行信息
    function writeBankUsOther(data) {
        $('.bank-us-other .bank_name').val(data.bank_name);
        $('.bank-us-other .bank_address').val(data.bank_address);
        $('.bank-us-other .swift_code').val(data.swift_code);
        $('.bank-us-other .routing_number').val(data.routing_number);
        $('.bank-us-other .account_number').val(data.account_number);
        if (data.account_type == 'Savings') {
            $('.bank-us-other .account_type .savings').addClass('checked').siblings('.checking').removeClass('checked');
        } else {
            $('.bank-us-other .account_type .checking').addClass('checked').siblings('.savings').removeClass('checked');
        }
    }

    // 写入非美其他银行信息
    function writeBankCnOther(data) {
        $('.bank-cn-other .bank_name').val(data.bank_name);
        $('.bank-cn-other .bank_address').val(data.bank_address);
        $('.bank-cn-other .swift_code').val(data.swift_code);
        $('.bank-cn-other .account_number').val(data.account_number);
        if (data.have_middle_bank) {
            $('.bank-cn-other .middle_bank_name').val(data.middle_bank_name);
            $('.bank-cn-other .middle_bank_address').val(data.middle_bank_address);
            $('.bank-cn-other .middle_bank_swift_code').val(data.middle_bank_swift_code);
            $('.middle-bank').show();
        }
    }
});
