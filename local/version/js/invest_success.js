/**
 * Created by zhiqiang.li on 2017/3/3.
 */
$(function () {
    var product_id = getUrlParam('product_id') || '';
    var partner_id = getUrlParam('partner_id') || '';
    var phone = getUrlParam('phone') || '';
    var order_number = getUrlParam('order_number') || '';
    var bank_name = getUrlParam('bank_name') || '';
    var account_number = getUrlParam('account_number') || '';
    var payment_method = getUrlParam('payment_method') || '';

    $("#order_number").html(order_number);
    $(".user_pay").html(bank_name + '(' + account_number);

    //获取产品支持的支付方式
    getData({
        url: base_url + '/white_label/product/payment_list',
        data: {product_id: product_id},
        async: false,
        sucFn: paymentSuc,
        failFn: failFn
    });

    function paymentSuc(res) {
        if (res.body != null) {
            var d = res.body;
            /*if (d.is_ach_enabled) {
                $(".user_pay").html(bank_name + '(' + account_number);
            }*/
            if (d.is_receive_bank_enabled) {
                if (d.receive_bank.account_name != '') {
                    $("#wire_name").html(d.receive_bank.account_name);
                } else {
                    $("#wire_name").closest('.row').remove();
                }
                if (d.receive_bank.account_address != '') {
                    $("#wire_address").html(d.receive_bank.account_address);
                } else {
                    $("#wire_address").closest('.row').remove();
                }
                if (d.receive_bank.bank_name != '') {
                    $("#wire_bank").html(d.receive_bank.bank_name);
                } else {
                    $("#wire_bank").closest('.row').remove();
                }
                if (d.receive_bank.bank_address != '') {
                    $("#wire_bank_address").html(d.receive_bank.bank_address);
                } else {
                    $("#wire_bank_address").closest('.row').remove();
                }
                if (d.receive_bank.swift_code != '') {
                    $("#wire_us_swiftCode").html(d.receive_bank.swift_code);
                } else {
                    $("#wire_us_swiftCode").closest('.row').remove();
                }
                if (d.receive_bank.routing_number != '') {
                    $("#wire_us_bank_routing").html(d.receive_bank.routing_number);
                } else {
                    $("#wire_us_bank_routing").closest('.row').remove();
                }
                if (d.receive_bank.account_number != '') {
                    $("#wire_account").html(d.receive_bank.account_number);
                } else {
                    $("#wire_account").closest('.row').remove();
                }
                if (d.receive_bank.remark != '') {
                    $("#wire_remark").html(d.receive_bank.remark);
                } else {
                    $("#wire_remark").closest('.row').remove();
                }
            }
            if (d.is_middle_bank_enabled) {
                if (d.middle_bank.bank_name != '') {
                    $("#wire_middle_bank").html(d.middle_bank.bank_name);
                } else {
                    $("#wire_middle_bank").closest('.row').remove();
                }
                if (d.middle_bank.bank_address != '') {
                    $("#wire_middle_bank_address").html(d.middle_bank.bank_address);
                } else {
                    $("#wire_middle_bank_address").closest('.row').remove();
                }
                if (d.middle_bank.routing_number != '') {
                    $("#wire_middle_bank_swiftCode").html(d.middle_bank.routing_number);
                } else {
                    $("#wire_middle_bank_swiftCode").closest('.row').remove();
                }
            } else {
                $(".middle-bank").hide();
            }
            if (payment_method == 'ach') {
                $(".ach").show();
            }
            if (payment_method == 'wire') {
                $(".wire").show();
            }
        }
    }

    function failFn() {

    }
});