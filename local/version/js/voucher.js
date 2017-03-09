$(function () {
    var product_id = getUrlParam('product_id') || '';
    var partner_id = getUrlParam('partner_id') || '';
    var phone = getUrlParam('phone') || '';
    var order_number = getUrlParam('order_number') || '';
    if (phone != '') {
        if(phone.indexOf(' ')){
            $('#phone').val(phone.split(' ')[1]);
        }else{
            $('#phone').val(phone);
        }
    }
    if (product_id != '') {
        getData({
            url: base_url + '/white_label/product_info',
            data: {product_id: product_id},
            sucFn: getProductSuc,
            failFn: getProductFail
        });
    }

    function getProductSuc(res) {
        if (res.body.status !== 'FOR_INVEST') {
            window.location = '/auxiliary_order/errLink.html';
            return false;
        } else {
            $('#product-name').html(res.body.name);
        }
    }

    function getProductFail(res) {
        alert(res.msg)
    }

    $('#get_code').on('click', function () {
        $(this).prop('disabled', true);
        phone = $("#phone").val();
        var $that = $(this);
        if (!(/^1\d{10}$/.test(phone))) {
            $("#error").html('请输入您的手机号码');
            $(this).prop('disabled', false);
            return false;
        } else {
            var timer = null, i = 60;
            timer = setInterval(function () {
                $('#get_code').html(i + '秒后重新发送');
                i--;
                if (i == 0) {
                    clearInterval(timer);
                    $that.prop('disabled', false);
                    $that.html('重新获取验证码');
                    i = 60;
                }
            }, 1000);
            if (phone.indexOf('+') == -1) {
                phone = '+86 ' + phone;
            }
            getData({
                url: base_url + '/zion/common/verify_code',
                data: {phone: phone, channel_code: partner_id},
                async: false,
                sucFn: getCodeSuc,
                failFn: failFn
            });
        }
        return false;
    });

    $('#submit').on('click', function () {
        $(this).prop('disabled', true);
        phone = $("#phone").val();
        var verify_code = $("#verify_code").val();
        if (!/^1\d{10}$/.test(phone)) {
            $("#error").html('请输入您的手机号码');
            $(this).prop('disabled', false);
            return false;
        }
        if (verify_code == '') {
            $("#error").html('请输入您的校验码');
            $(this).prop('disabled', false);
            return false;
        } else {
            if (phone.indexOf('+') == -1) {
                phone = '+86 ' + phone;
            }
            getData({
                url: base_url + '/zion/common/voucher',
                data: {phone: phone, channel_code: partner_id, verify_code: verify_code},
                async: false,
                sucFn: voucherSuc,
                failFn: failFn
            });
        }
    });
    function getCodeSuc(res) {
        console.log('获取验证码成功');
    }

    function voucherSuc(res) {
        if (phone.indexOf('+') == -1) {
            phone = '+86 ' + phone;
        }

        if (order_number != '') {
            window.location = '/white_label/signature.html?product_id=' + product_id + '&partner_id=' + partner_id + '&phone=' + phone + '&access_token=' + res.body.token + '&order_number=' + order_number;
        } else {
            window.location = '/invest.html?product_id=' + product_id + '&partner_id=' + partner_id + '&phone=' + phone + '&access_token=' + res.body.token;
        }
    }

    function failFn(res) {
        $("#error").html(res.msg);
        $("#submit, #get_code").prop('disabled', false);
    }


    $('input').on('focus', function () {
        $("#error").empty();
    })
});